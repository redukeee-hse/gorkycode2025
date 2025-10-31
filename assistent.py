from flask import Flask, render_template, request
from openai import OpenAI
import re
from dotenv import load_dotenv
import os
import markdown2
from datetime import datetime
import pytz

load_dotenv()

app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def format_text(text):
    """Преобразует Markdown-текст в аккуратный HTML."""
    html = markdown2.markdown(
        text,
        extras=["fenced-code-blocks", "tables", "break-on-newline", "strike", "underline"]
    )
    html = html.replace("<ul>", '<ul style="margin-left:20px;">')
    html = html.replace("<h2>", '<h2 style="margin-top:25px;">')
    html = html.replace("<h3>", '<h3 style="margin-top:20px;">')
    return html

def get_local_time():
    return datetime.now(pytz.timezone('Europe/Moscow'))

def generate_route(interests, time, location):
    prompt = f"""
Ты — туристический AI-гид по Нижнему Новгороду.
Пользователь указал:
- Интересы: {interests}
- Время на прогулку: {time} часов
- Текущее местоположение: {location}
- Местное время: {get_local_time()}

Составь персональный план прогулки:
1. Подбери 3–5 реальных мест в Нижнем Новгороде, которые соответствуют интересам пользователя.
2. Объясни, почему ты выбрал каждое место.
3. Предложи логичный маршрут и примерный таймлайн (в часах).
4. Сформулируй ответ красиво и понятно
5. Ты должен учитывать по времени, что человек должен еще добраться до места назначения. 
6.Сформулируй ответ в **Markdown**, используй:
- заголовки `##`, `###` для разделов,
- не используй нумерацию для разделов,
- жирный шрифт для мест и времени,
- списки для маршрутов.
7. Не спрашивай в конце, хочет ли пользователь чего то, закончи свой ответ практическими рекомендациями.

"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "Ты — дружелюбный гид по Нижнему Новгороду."},
                  {"role": "user", "content": prompt}],
        temperature=0.8,
    )
    
    return format_text(response.choices[0].message.content.strip())
    

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        interests = request.form["interests"]
        time = request.form["time"]
        location = request.form["location"]
        plan = generate_route(interests, time, location)
        return render_template("index.html", plan=plan, yandex_api=os.getenv("YANDEX_API_KEY"))
    return render_template("index.html", plan=None)

if __name__ == "__main__":
    app.run(debug=True)
