from flask import Flask, render_template, request
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_route(interests, time, location):
    prompt = f"""
Ты — туристический AI-гид по Нижнему Новгороду.
Пользователь указал:
- Интересы: {interests}
- Время на прогулку: {time} часов
- Текущее местоположение: {location}

Составь персональный план прогулки:
1. Подбери 3–5 реальных мест в Нижнем Новгороде, которые соответствуют интересам пользователя.
2. Объясни, почему ты выбрал каждое место.
3. Предложи логичный маршрут и примерный таймлайн (в часах).
4. Сформулируй ответ красиво и понятно
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "Ты — дружелюбный гид по Нижнему Новгороду."},
                  {"role": "user", "content": prompt}],
        temperature=0.8,
    )
    
    return response.choices[0].message.content.strip()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        interests = request.form["interests"]
        time = request.form["time"]
        location = request.form["location"]
        plan = generate_route(interests, time, location)
        return render_template("index.html", plan=plan)
    return render_template("index.html", plan=None)

if __name__ == "__main__":
    app.run(debug=True)
