from flask import Flask, render_template

# Initialize the Flask application
app = Flask(__name__)

# Create a route for the homepage
@app.route('/')
def home():
    # This automatically looks inside the 'templates' folder, 
    # processes all the {% include %} tags, and serves the final HTML.
    return render_template('index.html')

if __name__ == '__main__':
    # Run the app in debug mode so it updates automatically when you save changes
    app.run(debug=True)
