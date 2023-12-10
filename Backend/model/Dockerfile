FROM --platform=linux/x86-64 python:3.8

WORKDIR /opt/ml
COPY ./chatbot/ /opt/ml/

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/ml:${PATH}"
ENV PYTHONPATH=.

RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get -y update && apt-get install -y --no-install-recommends \
    libusb-1.0-0-dev \
    libudev-dev \
    build-essential \
    ca-certificates \
    nginx && \ 
    rm -fr /var/lib/apt/lists/* 

ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:8080", "app:app", "-n"]
