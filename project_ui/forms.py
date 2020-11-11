<<<<<<< HEAD
from wtforms import Form, StringField, SelectField
class MusicSearchForm(Form):
    choices = [('Song', 'Song'),
               ('Artist', 'Artist')]
    select = SelectField('Search for music:', choices=choices)
=======
from wtforms import Form, StringField, SelectField
class MusicSearchForm(Form):
    choices = [('Song', 'Song'),
               ('Artist', 'Artist')]
    select = SelectField('Search for music:', choices=choices)
>>>>>>> c6921bbb7925be5590f91ab11056d37b0150e4ca
    search = StringField('')