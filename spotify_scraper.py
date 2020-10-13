import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
import psycopg2 as pg
import sqlalchemy as sql

CLIENT_ID = '3aa61ed19d084b3d996991f3bb3d0b3e'
CLIENT_SECRET = '7a273c762d324a4698f3364ae07f9da7'
redirect_uri = 'http://localhost:8080'
scope = "user-library-read"

# try:
#     conn = pg.connect("dbname='spotify' user='postgres' password='october13'")
#     print('connected')
    
# except: 
#     print('cant connect')

# def executeQuery(query, params=None):        
#     with conn.cursor() as cur:    
#         try:
#             cur.execute(query, params) #psycopg2 docs on cursor.execute() to understand params
#         except Exception:
#             conn.rollback()
#             print('This query didnt work:\n {0}'.format(query))
#         cur.close()
#         conn.commit() #actually pushes it to Postgres
#     return




sp = spotipy.Spotify(auth_manager=SpotifyOAuth(redirect_uri=redirect_uri,scope=scope, client_id=CLIENT_ID, client_secret=CLIENT_SECRET))
results = sp.current_user_saved_tracks()
for idx, item in enumerate(results['items']):
    track = item['track']
    print(idx, track['artists'][0]['name'], " – ", track['name'])