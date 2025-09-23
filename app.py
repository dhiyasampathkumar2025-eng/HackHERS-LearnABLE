from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/visual-impairment')
def visual_impairment():
    return render_template('visual-impairment.html')

if __name__ == '__main__':
    app.run(debug=True)
