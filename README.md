# music_box
Playlist generator for Spotify users

DESCRIPTION
Data Collection and Processing
All of the files to generate the dataset are located in the CODE\data_collection_and_processing folder. 
NOTE: Since we used multithreading in order to expedite the data pipeline creation process, there were 8 duplicates of each of the SampleLyricGenius and SampleVADERSentimentAnalysis notebooks that all ran simultaneously on chunks of the whole dataset. In order to save space, we have included the template for each notebook and a small dataset that can be used to demonstrate how the notebooks work. 
Here is a brief description of the files:
seed_artists_final.csv: The input to the SpotifyDataScraper notebook. Contains a list of artists to be used to create the initial database. 
SpotifyDataScraper.ipynb: This file takes a list of seed artists, uses spotipy's artist_related_artists method to get related artists, pulls all albums for those artists and finally all songs and audio features. This produced 455,285 unique tracks with accompanying audio features. 
sample_spotify_songs.csv: The output of the SpotifyDataScraper notebook. Contains a sample of 100 songs, artists, and musical features from Spotify. Used as the input in the SampleLyricGenius notebook.
SampleLyricGenius.ipynb: This file utilized the LyricsGenius API to pull in lyrics for the songs dataset generated by SpotifyDataScraper.ipynb. This was able to pull in lyrics for 289,000 songs. It can be run using the sample_spotify_songs.csv data.
SampleLyricData.csv: The output of the SampleLyricGenius notebook. Sample of 100 rows that contains all of the original Spotify data as well as a new feature that includes the lyrics (if available) for a song. Used as the input in the SampleVADERSentimentAnalysis notebook.
SampleVADERSentimentAnalysis.ipynb: This file utilized the Python library Vader to perform sentiment analysis on the lyrics pulled in from the LyricsGenius API. The sentiment analysis led to a “lyrical valence” score that was added to the dataset created by. It can be run using the SampleLyricData.csv data..
MusicBoxUserExperienceEvaluation.csv: This is the output of the Google form used to collect user experience testing results. Used as the input to the ResultsAnalysis.ipynb
ResultsAnalysis.ipynb: This notebook was used to analyze the results of our user experience testing in order to draw conclusions about the application as a whole.
After processing the data a bit more manually for duplicates and removing tracks that were interviews rather than actual songs, we ended up with a final dataset of 391,548 songs, with the track id, song name, artist, album, and audio features.
User Interface Build
All of the files to build our app are located in the CODE\project_ui_final folder. We used Flask, Python, JavaScript, D3, JQuery, HTML and CSS to create the user interface. Here is a brief description of the files:
app.py: This is the main file that creates and ultimately runs our Flask app. It is responsible for feeding information between the user interface and our recommendation algorithm.
recommender.py: Houses the recommendation algorithm that produces the final 20 recommended songs and the PCA data used in the graph on our site.
static\d3-tip.min.js, static\d3.v5.min.js, static\jquery-3.5.1.min.js: JavaScript and JQuery libraries used to build our other JavaScript files.
static\spotify_songs.csv: The final dataset used for our app.
static\clustered_pca_rick_roll: The dataset used for the visualization that first appears when the app is loaded.
static\clustered_pca.csv: The dataset used for the visualization when a different song is searched.
static\mastermap.js: A JavaScript file that creates the visualization on for the user interface and does some error handling.
static\dropdown.js: A JavaScript file that creates the dropdown menu, adds functionality for the slider bars, and does some error handling.
static\style.css: The CSS file that styles the user interface.
static\MusicBox_Banner.png: The logo image for our app.
templates\index.html: The HTML file for the user interface.
Dockerfile: The Dockerfile that builds the container for our app.
requirements.text: Contains all the required Python packages for our app. Needed for the Heroku deployment and Docker container build.
Procfile: A Heroku specific file needed for Heroku deployment.
INSTALLATION
Link to Unlisted YouTube Demo: https://youtu.be/eRUxgKFeeXY 
Our app is hosted at the following link: https://out-of-the-music-box.herokuapp.com/
NOTE: It is best viewed in full screen and in an incognito Google Chrome window.
In the event the web application does not run for you, or crashes, please follow the steps below to run it locally:
Ensure you have Docker installed on your local machine.
Navigate via command line into the directory team065final/CODE/ project_ui_final .
From that directory, input the following two commands:
1. docker build -t projectfinal:latest .
2. docker container run -dit -p 5000:5000 projectfinal:latest
Open Google Chrome, preferably in a large and incognito window.
Navigate to: http://127.0.0.1:5000
EXECUTION
Once you have navigated to the website or have the code running locally, the first step is to go to the search bar (at the top) and search for a song you would like to find similar songs to. The search bar has a dropdown that will appear for you to select the song, artist, and album from; it may be a bit slow to load. You can adjust the audio features (on the left) using the slider bars to determine if each musical feature should be lower, similar, or higher than your selected song. When you are happy with your selection and weights, hit the submit button, wait a few seconds for the page to load, and see your recommendations!

