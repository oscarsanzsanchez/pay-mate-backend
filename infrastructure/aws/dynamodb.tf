resource "aws_dynamodb_table" "pay_mate_users" {
  name           = "PayMateUsers"
  billing_mode   = "PAY_PER_REQUEST" # On-demand pricing, a bit more expensive but no capacity planning required
  stream_enabled = false
  hash_key       = "id"    # Partition key independent of the email, as if the user changes the email, we might get into trouble by deleting and recreating the user
  range_key      = "email" # Range key, as we want to be able to query by email

  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    projection_type = "ALL"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  tags = {
    Project = "PayMate"
    Type    = "Sideproject"
  }
}
