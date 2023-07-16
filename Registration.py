from flask import Flask

app = Flask(__name__)


@app.route('/')
#first view home page
def home():
    return render_template("home.html")

#takes user to the sign up page
@app.route("/signup")
def signup():
    return render_template("signup.html")

if __name__ == "__main__":
    app.run()
