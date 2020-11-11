<<<<<<< HEAD
from flask import Flask
from flask import flash, render_template, request, redirect, url_for, jsonify, Response
from forms import MusicSearchForm
import csv
import os
import json
import pandas as pd
import numpy as np
from recommender import recommendation
from spotify_rec import spotify_rec

app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route('/', methods=['GET','POST'])
def index():
    iframes=[]
    ##search = MusicSearchForm(request.form)
    if request.method == 'POST':
        search=request.form['songSearch']
        danceability=int(request.form['dance'])
        energy = int(request.form['energy'])
        key = int(request.form['key'])
        loudness= int(request.form['loudness'])
        mode=int(request.form['mode'])
        speech=int(request.form['speech'])
        acousticness=int(request.form['acousticness'])
        instrumentalness=int(request.form['instrumentalness'])
        liveness=int(request.form['liveness'])
        valence=int(request.form['valence'])
        tempo=int(request.form['tempo'])
        user_inputs=[danceability,energy,key,loudness,mode,speech,acousticness,instrumentalness,liveness,valence,tempo]
        return search_results(search,user_inputs)
    return render_template('index.html',iframes=iframes)

@app.route('/results')
def search_results(search,user_inputs):
    df=pd.read_csv('static/spotify_songs.csv')
    search = search.split(" | ")
    song=search[0]
    artist=search[1]
    album = search[2]
    seed_index=df.index[(df['song_name']==song) & (df['artist']==artist) & (df['album']==album)][0]
    sp_rec=spotify_rec(df.iloc[seed_index,0])
    df,iframes,df_graph=recommendation(seed_index,user_inputs)
    return render_template('index.html',inputs=user_inputs,tables=[df.to_html(classes='data')],titles=df.columns.values,iframes=iframes,sp_rec=sp_rec,df_graph=df_graph)  

@app.route('/getMyJson')
def getMyJson():
    df_graph=pd.read_csv('static/clustered_pca.csv')
    json = df_graph.to_json(orient='records', date_format='iso')
    response = Response(response=json, status=200, mimetype="application/json")
    return(response)

""" @app.route('/results')
def search_results(search,user_inputs):
    df=pd.read_csv('static/spotify_songs.csv')
    #search_string = search.data['search']
    search = search.split(" / ")
    song=search[0]
    artist=search[1]
    album = search[2]
    seed_index=df.index[(df['song_name']==song) & (df['artist']==artist) & (df['album']==album)][0]
    sp_rec=spotify_rec(df.iloc[seed_index,0])
    df,iframes=recommendation(seed_index,user_inputs)
    return render_template('results.html',inputs=user_inputs,tables=[df.to_html(classes='data')],titles=df.columns.values,iframes=iframes,sp_rec=sp_rec) """

if __name__ == '__main__':
=======
from flask import Flask
from flask import flash, render_template, request, redirect
from forms import MusicSearchForm
import csv
import os
import pandas as pd
import numpy as np
from recommender import recommendation
from spotify_rec import spotify_rec

app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route('/', methods=['GET','POST'])
def index():
        
    ##search = MusicSearchForm(request.form)
    if request.method == 'POST':
        search=request.form['songSearch']
        danceability=int(request.form['dance'])
        energy = int(request.form['energy'])
        key = int(request.form['key'])
        loudness= int(request.form['loudness'])
        mode=int(request.form['mode'])
        speech=int(request.form['speech'])
        acousticness=int(request.form['acousticness'])
        instrumentalness=int(request.form['instrumentalness'])
        liveness=int(request.form['liveness'])
        valence=int(request.form['valence'])
        tempo=int(request.form['tempo'])
        user_inputs=[danceability,energy,key,loudness,mode,speech,acousticness,instrumentalness,liveness,valence,tempo]
        return search_results(search,user_inputs)
        ##return search_results(search)
    return render_template('index.html')

@app.route('/results')
def search_results(search,user_inputs):
    df=pd.read_csv('static/spotify_songs.csv')
    #search_string = search.data['search']
    search = search.split(" / ")
    song=search[0]
    artist=search[1]
    album = search[2]
    seed_index=df.index[(df['song_name']==song) & (df['artist']==artist) & (df['album']==album)][0]
    sp_rec=spotify_rec(df.iloc[seed_index,0])
    df,iframes=recommendation(seed_index,user_inputs)
    return render_template('results.html',inputs=user_inputs,tables=[df.to_html(classes='data')],titles=df.columns.values,iframes=iframes,sp_rec=sp_rec)

if __name__ == '__main__':
>>>>>>> c6921bbb7925be5590f91ab11056d37b0150e4ca
    app.run(host='127.0.0.1', port=3001, debug=True)