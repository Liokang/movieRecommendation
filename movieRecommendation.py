import sys


val1 = sys.argv[1]
val2 = sys.argv[2]
val3 = sys.argv[3]

import numpy as np
import pandas as pd


movies= pd.read_csv(r"C:/Users/atul2/Documents/movieRecommendation/tmdb_5000_movies.csv")
credits= pd.read_csv(r"C:/Users/atul2/Documents/movieRecommendation/tmdb_5000_credits.csv")


movies=movies.merge(credits,on='title')


movies=movies[['movie_id','title','overview','genres','keywords','cast','crew']]


movies.head()


movies.dropna(inplace=True)


def convert(obj):
    L =  []
    for i in eval(obj):
        L.append(i['name'])
    return L


movies['genres']=movies['genres'].apply(convert)



movies['keywords']=movies['keywords'].apply(convert)




def convert3(obj):
    L =  []
    counter = 0
    for i in eval(obj):
        if counter !=3:
            L.append(i['name'])
            counter+=1
        else:
            break
    return L




movies['cast']=movies['cast'].apply(convert3)



def fetchDirector(obj):
    L =  []
    for i in eval(obj):
        if i['job'] == 'Director':
            L.append(i['name'])
            break
    return L



movies['crew']=movies['crew'].apply(fetchDirector)
movies['overview']=movies['overview'].apply(lambda x:x.split())


movies['genres']=movies['genres'].apply(lambda x:[i.replace(" ","") for i in x])
movies['overview']=movies['overview'].apply(lambda x:[i.replace(" ","") for i in x])
movies['keywords']=movies['keywords'].apply(lambda x:[i.replace(" ","") for i in x])
movies['cast']=movies['cast'].apply(lambda x:[i.replace(" ","") for i in x])
movies['crew']=movies['crew'].apply(lambda x:[i.replace(" ","") for i in x])


movies['tags']=movies['overview']+movies['genres']+movies['keywords']+movies['cast']+movies['crew']



new_df=movies[['movie_id','title','tags']]



new_df['tags']= new_df['tags'].apply(lambda x: " ".join(x))


new_df['tags']=new_df['tags'].apply(lambda x:x.lower())


import nltk


from nltk.stem.porter import PorterStemmer
ps=PorterStemmer()




def stem(text):
    y = []
    
    for i in text.split():
        y.append(ps.stem(i))
        
    return " ".join(y)


new_df['tags']=new_df['tags'].apply(stem)



from sklearn.feature_extraction.text import CountVectorizer
cv= CountVectorizer(max_features=5000,stop_words='english')



vectors = cv.fit_transform(new_df['tags']).toarray()



from sklearn.metrics.pairwise import cosine_similarity


similarity=cosine_similarity(vectors)



def recommend(movie):
    movie_index =new_df[new_df['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)),reverse=True,key=lambda x:x[1])[1:15]
    
    for i in movies_list:
        print(new_df.iloc[i[0]].title)


recommend(val1)
recommend(val2)
recommend(val3)



