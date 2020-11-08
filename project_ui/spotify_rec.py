import spotipy
from spotipy.oauth2 import SpotifyOAuth

def spotify_rec(seed_song):
    scope = "user-library-read"
    redirect_uri = 'http://localhost:8080'
    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(redirect_uri=redirect_uri,scope=scope))
    rec = sp.recommendations(seed_tracks=[seed_song])['tracks']
    if rec==[]:
        return ['No Spotify recommendations for this song!']
    else:
        rec_list=[]
        for i in rec:
            track=i['id']
            track="https://open.spotify.com/embed/track/"+track
            rec_list.append(track)
        return rec_list

