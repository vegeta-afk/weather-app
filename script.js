const weatherImages = {
  sunny: {
    day: "https://images.unsplash.com/photo-1541119638723-c51cbe2262aa?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    night:
      "https://images.unsplash.com/photo-1628725022723-00a47a683320?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  rainy: {
    day: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    night:
      "https://images.unsplash.com/photo-1646277586472-6d5600854899?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  cloudy: {
    day: "https://images.unsplash.com/photo-1464660439080-b79116909ce7?q=80&w=1202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    night:
      "https://images.unsplash.com/photo-1501418611786-e29f9929fe03?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  snowy: {
    day: "https://images.unsplash.com/photo-1577928614565-ef010b14b8bb?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    night:
      "https://plus.unsplash.com/premium_photo-1672070779458-cb842bdadca7?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  mist: {
    day: "https://images.unsplash.com/photo-1595736516846-c9fe0cb86f7c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    night:
      "https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  foggy: {
    day: "https://plus.unsplash.com/premium_photo-1710248799611-96aa6db855b9?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    night:
      "https://images.unsplash.com/photo-1736714859462-c02878f2877a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  default: {
    day: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    night:
      "https://images.unsplash.com/photo-1531961463838-b2d6c87c7f37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
};

async function getWeather() {
  const cityName = document.getElementById("userinput").value;
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = "";

  if (!cityName) {
    errorElement.textContent = "Please enter a city name!";
    return;
  }

  document.querySelector(".weather-card").classList.add("loading");

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=46ada54c8de044a1891123624252108&q=${encodeURIComponent(
        cityName
      )}&aqi=yes`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `Weather API error: ${response.status}`
      );
    }

    const data = await response.json();

    document.getElementById("city").innerText =
      data.location.name.toUpperCase();
    document.getElementById("temp").innerText = Math.round(data.current.temp_c);
    document.getElementById("weather-icon").src =
      "https:" + data.current.condition.icon;
    document.getElementById("condition").innerText =
      data.current.condition.text;
    document.getElementById("humidity").innerText = data.current.humidity;

    const airQuality = data.current.air_quality
      ? data.current.air_quality["pm2_5"].toFixed(1)
      : "-";
    document.getElementById("airq").innerText = airQuality;

    updateBackgroundImage(data.current.condition.text, data.current.is_day);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    errorElement.textContent =
      error.message || "Failed to fetch weather data. Please try again.";
  } finally {
    document.querySelector(".weather-card").classList.remove("loading");
  }
}

function updateBackgroundImage(conditionText, isDay) {
  const condition = conditionText.toLowerCase();
  const imageElement = document.getElementById("background-image");
  const creditElement = document.getElementById("image-credit");
  let imageKey = "default";
  const timeOfDay = isDay ? "day" : "night";

  if (condition.includes("clear") || condition.includes("sunny")) {
    imageKey = "sunny";
  } else if (
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    condition.includes("shower")
  ) {
    imageKey = "rainy";
  } else if (condition.includes("cloud") || condition.includes("overcast")) {
    imageKey = "cloudy";
  } else if (
    condition.includes("snow") ||
    condition.includes("sleet") ||
    condition.includes("ice")
  ) {
    imageKey = "snowy";
  } else if (
    condition.includes("storm") ||
    condition.includes("thunder") ||
    condition.includes("lightning")
  ) {
    imageKey = "stormy";
  } else if (
    condition.includes("mist") ||
    condition.includes("fog") ||
    condition.includes("haze")
  ) {
    imageKey = "foggy";
  }

  imageElement.src = weatherImages[imageKey][timeOfDay];
  creditElement.textContent = "Photo: " + weatherImages[imageKey].credit;

  imageElement.onload = function () {
    imageElement.style.opacity = 1;
  };

  imageElement.onerror = function () {
    console.error("Error loading image, using default");
    imageElement.src = weatherImages.default[timeOfDay];
  };
}

document.getElementById("userinput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

window.onload = function () {
  document.getElementById("userinput").value = "Madrid";
  updateBackgroundImage("Sunny", 1);
};
