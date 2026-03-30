#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ENV_FILE:-${SCRIPT_DIR}/import-rds-from-s3.env}"
if [ -f "${ENV_FILE}" ]; then
  set -a
  . "${ENV_FILE}"
  set +a
fi

ORACLE_CONTAINER="${ORACLE_CONTAINER:-oracle-19c}"
RDS_HOST="${RDS_HOST:?Set RDS_HOST}"
RDS_SERVICE="${RDS_SERVICE:?Set RDS_SERVICE}"
RDS_ADMIN_USER="${RDS_ADMIN_USER:?Set RDS_ADMIN_USER}"
RDS_ADMIN_PASSWORD="${RDS_ADMIN_PASSWORD:?Set RDS_ADMIN_PASSWORD}"
RDS_SCHEMA="${RDS_SCHEMA:-APP}"
RDS_SCHEMA_USER="${RDS_SCHEMA_USER:-APP}"
RDS_SCHEMA_PASSWORD="${RDS_SCHEMA_PASSWORD:?Set RDS_SCHEMA_PASSWORD}"
DATA_PUMP_DIR="${DATA_PUMP_DIR:-DATA_PUMP_DIR}"
S3_BUCKET="${S3_BUCKET:?Set S3_BUCKET}"
S3_PREFIX="${S3_PREFIX:-backups}"
DUMPFILE="${DUMPFILE:?Set DUMPFILE (e.g. app_20260114181610.dmp)}"

S3_PREFIX="${S3_PREFIX%/}"

echo "Downloading ${DUMPFILE} from S3 into RDS DATA_PUMP_DIR..."
docker exec -i "${ORACLE_CONTAINER}" bash -lc "sqlplus -s ${RDS_ADMIN_USER}/${RDS_ADMIN_PASSWORD}@//${RDS_HOST}:1521/${RDS_SERVICE} <<SQL
set heading off feedback off pagesize 0 verify off
select rdsadmin.rdsadmin_s3_tasks.download_from_s3(
  p_bucket_name    => '${S3_BUCKET}',
  p_s3_prefix      => '${S3_PREFIX}/${DUMPFILE}',
  p_directory_name => '${DATA_PUMP_DIR}'
) as task_id from dual;
grant read, write on directory ${DATA_PUMP_DIR} to ${RDS_SCHEMA_USER};
SQL"

echo "Importing schema ${RDS_SCHEMA} into RDS..."
docker exec -i "${ORACLE_CONTAINER}" bash -lc \
  "impdp ${RDS_SCHEMA_USER}/${RDS_SCHEMA_PASSWORD}@//${RDS_HOST}:1521/${RDS_SERVICE} \
   schemas=${RDS_SCHEMA} \
   directory=${DATA_PUMP_DIR} \
   dumpfile=${DUMPFILE} \
   logfile=imp_${DUMPFILE%.dmp}.log"

echo "Done."
