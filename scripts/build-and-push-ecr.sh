#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ENV_FILE:-${SCRIPT_DIR}/build-and-push-ecr.env}"
if [ -f "${ENV_FILE}" ]; then
  set -a
  . "${ENV_FILE}"
  set +a
fi

AWS_REGION="${AWS_REGION:?Set AWS_REGION}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:?Set AWS_ACCOUNT_ID}"
ECR_REPO="${ECR_REPO:?Set ECR_REPO}"
IMAGE_TAG="${IMAGE_TAG:-$(date +%Y%m%d%H%M%S)}"
DOCKERFILE="${DOCKERFILE:-Dockerfile.lambda}"
PLATFORM="${PLATFORM:-linux/amd64}"
UPDATE_LAMBDA="${UPDATE_LAMBDA:-false}"
BUILD_ASSETS="${BUILD_ASSETS:-true}"

AWS_PROFILE_OPT=()
if [ -n "${AWS_PROFILE:-}" ]; then
  AWS_PROFILE_OPT=(--profile "${AWS_PROFILE}")
fi

REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${REGISTRY}/${ECR_REPO}:${IMAGE_TAG}"

echo "Logging in to ECR: ${REGISTRY}"
aws "${AWS_PROFILE_OPT[@]}" ecr get-login-password --region "${AWS_REGION}" | \
  docker login --username AWS --password-stdin "${REGISTRY}"

if [ "${BUILD_ASSETS}" = "true" ]; then
  echo "Building frontend assets..."
  npm ci
  npm run build
fi

echo "Building and pushing ${IMAGE_URI} (platform: ${PLATFORM})"
docker buildx build \
  --platform "${PLATFORM}" \
  -f "${DOCKERFILE}" \
  -t "${IMAGE_URI}" \
  --push \
  .

if [ "${UPDATE_LAMBDA}" = "true" ]; then
  : "${LAMBDA_FUNCTION_NAME:?Set LAMBDA_FUNCTION_NAME when UPDATE_LAMBDA=true}"
  echo "Updating Lambda ${LAMBDA_FUNCTION_NAME}"
  aws "${AWS_PROFILE_OPT[@]}" lambda update-function-code \
    --region "${AWS_REGION}" \
    --function-name "${LAMBDA_FUNCTION_NAME}" \
    --image-uri "${IMAGE_URI}"
fi

echo "Done: ${IMAGE_URI}"
