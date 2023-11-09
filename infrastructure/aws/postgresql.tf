resource "random_string" "pay_mate-db-password" {
  length  = 32
  upper   = true
  numeric = true
  special = false
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "pay_mate" {
  vpc_id      = data.aws_vpc.default.id
  name        = "pay_mate"
  description = "Allow all inbound for Postgres"
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "pay_mate" {
  identifier             = "paymate"
  db_name                = "pay_mate"
  engine                 = "postgres"
  engine_version         = "14.9"
  instance_class         = "db.t2.micro"
  allocated_storage      = 5
  skip_final_snapshot    = true
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.pay_mate.id]
  username               = "root_pay_mate"
  password               = random_string.pay_mate-db-password.result

  tags = {
    Project = "PayMate"
    Type    = "Sideproject"
  }
}
