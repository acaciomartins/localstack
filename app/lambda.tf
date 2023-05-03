## Lambda

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "lambda.js"
  output_path = "lambda_function_payload.zip"
}

resource "aws_lambda_function" "example" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "example.zip"
  function_name = "ServerlessExample"
  role          = aws_iam_role.iam_for_lambda.arn
  handler = "main.handler"
  runtime = "nodejs16.x"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}