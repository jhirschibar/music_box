from numpy import linalg
import numpy as np
import pandas as pd
from sklearn.preprocessing import normalize, scale, Normalizer
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import validators
import requests
from bs4 import BeautifulSoup
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import TimeoutException

def recommendation(seed_index,user_inputs):
    df=pd.read_csv('static/spotify_songs.csv')
    feat = df[['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
        'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']].copy()
    feat = normalize(feat, norm='l2')
    cats = ['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
        'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']
    weights = dict(zip(cats, user_inputs))
    feat = pd.DataFrame(feat, columns=weights)
    test = user_inputs * feat
    test['scores']= linalg.norm(test.iloc[seed_index] - test, axis=1)

    #Code for PCA graph
    rec_pca=test.sort_values("scores").index[:250]
    feat = df[['popularity', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
       'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']]
    cats =['popularity', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
       'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']
    rec_song_df = feat.iloc[rec_pca,:].reset_index(drop=True)
    original_features = ['artist', 'song_name']
    identifier = df.loc[rec_pca][original_features].reset_index(drop=True)
    pca = PCA(n_components=2)
    pca_comp = pca.fit_transform(rec_song_df)
    pca_df = pd.DataFrame(data=pca_comp, columns=['pca1', 'pca2'])
    seed_song = pd.DataFrame(rec_song_df.iloc[0]).T
    seed_song = seed_song[cats]
    similarity = pd.DataFrame()
    seed_similarity = pd.DataFrame()
    def get_similarity (row,c,seed_song):
        
        min_same = seed_song[c][0] - (seed_song[c][0] * 0.34)
        max_same = seed_song[c][0] + (seed_song[c][0] * 0.34)
        if row[c] == seed_song[c][0]:
            return "="
        if row[c] < min_same:
            return '-'
        if row[c] > min_same:
            return '+'
        return '='

    for c in cats:
        similarity[c] = rec_song_df.apply(lambda row: get_similarity(row,c,seed_song), axis=1)

    for c in cats:
        seed_similarity[c+"_range"] = seed_song.apply(lambda row: get_similarity(row,c,seed_song), axis=1)
    
    df_graph = pd.concat([identifier, similarity, pca_df], axis = 1)

    df_graph.to_csv('static/clustered_pca.csv')

    #Code for final 20 recommendations
    rec = test.sort_values("scores").index[:21]
    final=df.iloc[rec][['song_name', 'artist','album','track_id']][1:]
    final.set_index(['song_name'],inplace=True)
    final.index.name=None
    final['track_id']="https://open.spotify.com/embed/track/"+final['track_id']
    iframes=final['track_id'].values.tolist()
    """ iframes_check=[]
    for i in iframes:
        r=requests.get(i)
        soup = BeautifulSoup(r.text, 'html.parser')
        check = soup.findAll('div',{'class':'main'})
        if check!=[]:
            iframes_check.append(i)
    iframes=iframes_check """
    iframes_check=[]
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome('static/chromedriver.exe',options=options)
    for i in iframes:
        try:
            
            driver.get(i)
            wait = WebDriverWait(driver, 10)
            xpath3 = '//*[@id="main"]'
            element = wait.until(ec.visibility_of_element_located((By.XPATH, xpath3)))
            iframes_check.append(i)
        except TimeoutException:
            continue
    driver.close()      
    iframes=iframes_check

    return final,iframes,df_graph
