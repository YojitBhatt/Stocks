from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

app = Flask(__name__)

# Dummy time-series stock data (replace with real historical prices)
data = np.array([110, 112, 115, 117, 120, 122, 123, 125, 126, 128, 130, 133, 135, 138, 140], dtype='float32')
window_size = 3

# Prepare data for LSTM
X = []
y = []
for i in range(len(data) - window_size):
    X.append(data[i:i+window_size])
    y.append(data[i+window_size])
X, y = np.array(X), np.array(y)
X = X.reshape((X.shape[0], X.shape[1], 1))

# Build and train LSTM model
model = Sequential([
    LSTM(50, activation='relu', input_shape=(window_size, 1)),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')
model.fit(X, y, epochs=200, verbose=0)

@app.route('/predict', methods=['POST'])
def predict():
    req = request.json
    last_prices = req.get('last_prices', None)
    if not last_prices or len(last_prices) != window_size:
        return jsonify({'error': f'Send last_prices as a list of length {window_size}'}), 400
    X_pred = np.array(last_prices, dtype='float32').reshape((1, window_size, 1))
    pred = model.predict(X_pred)
    return jsonify({'prediction': float(pred[0][0])})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)