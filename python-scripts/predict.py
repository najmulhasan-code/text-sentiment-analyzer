import sys
import json
import os
import joblib

def get_absolute_path(relative_path):
    """"
    Constructs an absolute path from a relative path.

    Parameters:
    relative_path (str): The relative path to the file.

    Returns:
    str: The absolute path to the file.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_dir, relative_path)

def load_model_and_vectorizer(model_path='sentiment_model.pkl', vectorizer_path='vectorizer.pkl'):
    """
    Load the trained model and vectorizer from disk.
    
    Parameters:
    model_path (str): The path to the saved model.
    vectorizer_path (str): The path to the saved vectorizer.

    Returns:
    tuple: The loaded model and vectorizer.
    """
    model = joblib.load(get_absolute_path(model_path))
    vectorizer = joblib.load(get_absolute_path(vectorizer_path))
    return model, vectorizer

def predict_sentiment(text, model, vectorizer):
    """
    Predicts the sentiment of the input text.

    Parameters:
    text (str): The input text.
    model (MultinomialNB): The traind model.
    vectorizer (CounterVectorizer): The vectorizer.

    Returns:
    dic: The prediction and confidence.
    """
    text_vectorized = vectorizer.transform([text])
    prediction = model.predict(text_vectorized)[0]
    confidence = model.predict_proba(text_vectorized).max()
    label_map = {0: 'Negative', 4: 'Positive'}
    return {"prediction": label_map[prediction], "confidence": float(confidence)}

def main(): 
    try:
        if len(sys.argv) != 2:
            print('Usage: python predict.py <text>')
            sys.exit(1)
    
        text = sys.argv[1]
        model, vectorizer = load_model_and_vectorizer()

        result = predict_sentiment(text, model, vectorizer)
    
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()