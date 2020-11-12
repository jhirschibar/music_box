FROM python:3.7

RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get -y install vim


WORKDIR /src/app
COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . /src/app


CMD python app.py