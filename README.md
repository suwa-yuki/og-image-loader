# The Open Graph protocol Image Loader from Website

This Application using Serverless Application Model (SAM).

## How To Deploy

### 1. Package

```bash
$ aws cloudformation package \
  --template-file template.yaml \
  --s3-bucket <your bucket> \
  --output-template-file output.yaml \
  --profile <your aws profile>
```

### 2. Deploy

```bash
$ aws cloudformation deploy \
  --template-file output.yaml \
  --stack-name og-image \
  --parameter-overrides Env=prd \
  --capabilities CAPABILITY_IAM \
  --profile <your aws profile>
```

## How To Use

```bash
$ curl \
  -X GET \
  -H 'Accept: image/png' \
  "https://<your api id>.execute-api.<aws region>.amazonaws.com/<stage>/og?url=https%3A%2F%2Fclassmethod.jp%2F&width=100&height=100&t=png" \
  > og-image.png
```

## License

MIT License.
