from website import create_app

app = create_app()

@app.route('/') 
def login():
    return render_template('login.html')

@app.route('/login, method=['GET', 'POST'])
def signup():
    return render_template('sign_up.html')

@app.route('/signup, method=['GET', 'POST'])
def index(): 
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

     
