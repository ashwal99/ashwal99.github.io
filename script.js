// Replace 'YOUR_CHATGPT_API_KEY' with your actual API key
const apiKey = 'sk-rUHmbQrbOLATxQBn2ZEhT' + '3BlbkFJJnuFH0HHJNriKCMYtlkG';
const chatbox = document.getElementById('message-area');
const userMessageInput = document.getElementById('user-message');
let context = [
  {
    'role': 'system',
    'content': `
      You are OrderBot, an automated service to collect orders for a pizza restaurant. \
      You first greet the customer, then collect the order, \
      and then ask if it's a pickup or delivery. \
      You wait to collect the entire order, then summarize it and check for a final \
      time if the customer wants to add anything else. \
      If it's a delivery, you ask for an address. \
      Finally, you collect the payment. \
      Make sure to clarify all options, extras, and sizes to uniquely \
      identify the item from the menu. \
      You respond in a short, very conversational friendly style. \
      The menu includes: \
      "Margherita | Classic pizza with tomato sauce and mozzarella cheese: Veg: Veg Pizza: #vegan, #chefSpecial", \
      "Pepperoni: Pizza with tomato sauce, mozzarella, and pepperoni: Non-veg: NV Pizza: #spicy, #recommended", \
      "Caesar Salad: Romaine lettuce, croutons, Parmesan cheese, Caesar dressing: Veg: Specialty: #dairyFree, #wantToRepeat", \
      "BBQ Chicken: Pizza with barbecue sauce, chicken, and onions: Non-veg: NV Pizza: #specialtyChicken, #mealFor2", \
      "Garlic Bread: Sliced baguette with garlic butter and Parmesan: Veg: Sides: #new, #sides", \
      "Chicken Alfredo: Fettuccine with creamy Alfredo sauce and chicken: Non-veg: Meals and combos: #containsDairy, #mealFor2", \
      "Vegan Burger: Plant-based burger patty with lettuce, tomato, and onion: Veg: Meals and combos: #guiltFree, #vegan, #mealFor2", \
      "Tandoori Chicken: Chicken marinated in Indian spices and grilled: Non-veg: Specialty: #spicy, #recommended, #new", \
      "Caprese Salad: Fresh mozzarella, tomato, and basil drizzled with balsamic: Veg: Specialty: #wantToRepeat, #dairyFree", \
      "Hawaiian Pizza: Pizza with tomato sauce, mozzarella, ham, and pineapple: Non-veg: NV Pizza: #new, #recommended"`
  }
];

function createMessageElement(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message ' + sender + '-message';
  messageElement.innerText = message;
  return messageElement;
}

function appendMessageToChatbox(messageElement) {
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function getCompletionFromPrompt(prompt) {
  return fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      'prompt': prompt,
      'model': 'text-davinci-003',
      'max_tokens': 2048,
      'temperature': 0.7
    })
  })
  .then(response => response.json())
  .then(data => data.choices[0].text.trim())
  .catch(error => console.error('Error:', error));
}

function sendMessage() {
  const userMessage = userMessageInput.value;
  if (userMessage.trim() !== '') {
    const userMessageElement = createMessageElement(userMessage, 'user');
    appendMessageToChatbox(userMessageElement);

    userMessageInput.value = '';

    context.push({ 'role': 'user', 'content': userMessage });

    let prompt = '';
    context.forEach(message => {
      prompt += `${message.role}: ${message.content}\n`;
    });

    getCompletionFromPrompt(prompt)
      .then(response => {
        context.push({ 'role': 'assistant', 'content': response });

        const botMessageElement = createMessageElement(response, 'bot');
        appendMessageToChatbox(botMessageElement);
      })
      .catch(error => console.error('Error:', error));
  }
}

userMessageInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});
