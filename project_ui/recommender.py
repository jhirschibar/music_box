from numpy import linalg
import numpy as np
import pandas as pd
from sklearn.preprocessing import normalize, scale, Normalizer
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

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
    rec = test.sort_values("scores").index[:21]
    final=df.iloc[rec][['song_name', 'artist','album','track_id']][1:]
    final.set_index(['song_name'],inplace=True)
    final.index.name=None
    final['track_id']="https://open.spotify.com/embed/track/"+final['track_id']
    iframes=final['track_id'].values.tolist()
    return final,iframes
