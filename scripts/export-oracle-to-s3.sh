#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ENV_FILE:-${SCRIPT_DIR}/export-oracle-to-s3.env}"
if [ -f "${ENV_FILE}" ]; then
  set -a
  . "${ENV_FILE}"
  set +a
fi

ORACLE_CONTAINER="${ORACLE_CONTAINER:-oracle-19c}"
PDB_SERVICE="${PDB_SERVICE:-TEXTILABPDB}"
SCHEMA="${SCHEMA:-APP}"
ORACLE_USER="${ORACLE_USER:-APP}"
ORACLE_PASSWORD="${ORACLE_PASSWORD:?Set ORACLE_PASSWORD}"
DATA_PUMP_DIR="${DATA_PUMP_DIR:-DATA_PUMP_DIR}"
S3_BUCKET="${S3_BUCKET:?Set S3_BUCKET}"
S3_PREFIX="${S3_PREFIX:-backups}"
AWS_PROFILE="${AWS_PROFILE:-}"

timestamp="$(date +%Y%m%d%H%M%S)"
schema_lower="$(printf '%s' "$SCHEMA" | tr '[:upper:]' '[:lower:]')"
DUMPFILE="${schema_lower}_${timestamp}.dmp"
LOGFILE="exp_${schema_lower}_${timestamp}.log"

echo "Exporting schema ${SCHEMA} from ${PDB_SERVICE}..."
docker exec -i "${ORACLE_CONTAINER}" bash -lc \
  "expdp ${ORACLE_USER}/${ORACLE_PASSWORD}@//localhost:1521/${PDB_SERVICE} \
   schemas=${SCHEMA} \
   directory=${DATA_PUMP_DIR} \
   dumpfile=${DUMPFILE} \
   logfile=${LOGFILE}"

DIR_PATH="$(docker exec -i "${ORACLE_CONTAINER}" bash -lc "sqlplus -s / as sysdba <<SQL
set heading off feedback off pagesize 0 verify off echo off
alter session set container=CDB\\\$ROOT;
select directory_path from dba_directories where directory_name='${DATA_PUMP_DIR}';
SQL" | tr -d '\r' | tail -n1 | xargs)"

if [ -z "${DIR_PATH}" ]; then
  echo "Could not resolve DATA_PUMP_DIR path. Check that ${DATA_PUMP_DIR} exists." >&2
  exit 1
fi

DMP_PATH="$(docker exec -i "${ORACLE_CONTAINER}" bash -lc "find \"${DIR_PATH}\" -name \"${DUMPFILE}\" -type f | sort | tail -n1" | tr -d '\r')"
LOG_PATH="$(docker exec -i "${ORACLE_CONTAINER}" bash -lc "find \"${DIR_PATH}\" -name \"${LOGFILE}\" -type f | sort | tail -n1" | tr -d '\r')"

if [ -z "${DMP_PATH}" ]; then
  echo "Dump file not found under ${DIR_PATH}." >&2
  exit 1
fi

echo "Copying ${DMP_PATH} to host..."
docker cp "${ORACLE_CONTAINER}:${DMP_PATH}" "./${DUMPFILE}"

if [ -n "${LOG_PATH}" ]; then
  docker cp "${ORACLE_CONTAINER}:${LOG_PATH}" "./${LOGFILE}"
fi

# S3_PREFIX="${S3_PREFIX%/}"
# AWS_PROFILE_OPT=()
# if [ -n "${AWS_PROFILE}" ]; then
#   AWS_PROFILE_OPT=(--profile "${AWS_PROFILE}")
# fi

# echo "Uploading to s3://${S3_BUCKET}/${S3_PREFIX}/${DUMPFILE}..."
# aws "${AWS_PROFILE_OPT[@]}" s3 cp "./${DUMPFILE}" "s3://${S3_BUCKET}/${S3_PREFIX}/${DUMPFILE}"

# if [ -f "./${LOGFILE}" ]; then
#   aws "${AWS_PROFILE_OPT[@]}" s3 cp "./${LOGFILE}" "s3://${S3_BUCKET}/${S3_PREFIX}/${LOGFILE}"
# fi

echo "Done."
