### 0. Prerequisite

- Already deployed on EC2 (43.201.105.74) so you can skip this

```sh
cd Backend/database

sudo pip3 install virtualenv
sudo apt install python3-virtualenv

virtualenv .venv
source .venv/bin/activate

pip install -r requirements.txt

cd tryot
python manage.py runserver
```

### 1. API
| URL                                      | Method |
|------------------------------------------|--------|
| 43.201.105.74/items/item-info/<item id>  | GET    |
| 43.201.105.74/user/user-info/<user id>   | GET    |
| 43.201.105.74/user/token-check/<token>   | GET    |
| 43.201.105.74/user/register              | POST   |
| 43.201.105.74/user/login                 | POST   |
| 43.201.105.74/user/logout                | POST   |
| 43.201.105.74/history/detail/<user id>   | GET    |
| 43.201.105.74/history/chat/<chatroom id> | GET    |