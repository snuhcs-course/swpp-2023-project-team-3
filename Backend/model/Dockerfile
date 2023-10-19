FROM --platform=linux/x86-64 python:3.8

RUN apt-get -y update && apt-get install -y --no-install-recommends \
    libusb-1.0-0-dev \
    libudev-dev \
    build-essential \
    ca-certificates \
    nginx && \ 
    rm -fr /var/lib/apt/lists/* 

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/ml:${PATH}"
ENV PYTHONPATH=.

WORKDIR /opt/ml

COPY ./container /opt/ml
RUN pipenv install --deploy --system --dev

ENTRYPOINT [ "", " ", "", "app:app", ""]