from contents import (
    ACCESS_KEY,
    SECRET_KEY,
    BUCKET_NAME,
    FILENM
)
import boto3

def download_imgvector():
    s3 = boto3.client("s3",
                  aws_access_key=ACCESS_KEY,
                  aws_secret_access_key=SECRET_KEY)
    s3.download_file(BUCKET_NAME, "./img_vectors.csv", FILENM)