const quotes = document.getElementById("quotes");
let name_of_quote = document.getElementById("floatingInput");
let text = document.getElementById("body");
const submit = document.getElementById("submit");
const yourQuotes = document.getElementById("yourQuotes");
const DB_NAME = "Quotes";
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = "personal-quotes";

var db;
let quoteList = [
  { name: "Awwal", quote: "Keep Trying Your Best" },
  {
    name: "Awwal",
    quote: "Life comes from heart and life returns to earth",
  },
  { name: "Awwal", quote: "Be the light that helps others see" },
  { name: "Awwal", quote: "Doubt Kills more dreams than failure ever will" },

  { name: "Awwal", quote: "Embrace the journey not just the destination" },
  { name: "Awwal", quote: "dream big, work hard, acheive greatness" },
  { name: "Awwal", quote: "in the midst of difficulty lies oppurtunity" },
  { name: "Awwal", quote: "the only limit is the one you set yourself" },

  { name: "Awwal", quote: "happiness is a choice, not a result" },
  { name: "Awwal", quote: "be a voice not an echo" },
  { name: "Awwal", quote: "Believe you can and you're half way there" },
  { name: "Awwal", quote: "don'nt wait for opportunity, create it" },

  {
    name: "Awwal",
    quote:
      "Challenges are what makes life intresting; overcoming them is what makes life meaningful",
  },
  {
    name: "Awwal",
    quote: "Be fearless in the pursuit of what sets your soul on fire.",
  },
  { name: "Awwal", quote: "Strive for progress, not perfection" },
  { name: "Awwal", quote: "Live life with intention, not by default" },

  { name: "Awwal", quote: "Great things never came from comfort zones" },
  { name: "Awwal", quote: "Don't be afraid to stand out in a crowd" },
  { name: "Awwal", quote: "You are the author of your own story" },
  { name: "Awwal", quote: "Be the change you wish to see in the world" },

  { name: "Awwal", quote: "Every day is a new chance to make a difference" },
  { name: "Awwal", quote: "Success starts with a single step" },
  { name: "Awwal", quote: "Your attitude determines your direction." },
  {
    name: "Awwal",
    quote: "Opportunities are everywhere, if you're open to seeing them.",
  },

  { name: "Awwal", quote: "Make each day your masterpiece" },
  { name: "Awwal", quote: "Your potential is endless" },
  { name: "Awwal", quote: "Kindness is a language that everyone understands" },
  { name: "Awwal", quote: "Passion is the fuel that drives success" },

  { name: "Awwal", quote: "Success is built on consistency" },
  { name: "Awwal", quote: "You are stronger than you think" },
  { name: "Awwal", quote: "Life is too short to live with regrets" },
  { name: "Awwal", quote: "Don't just follow your dreams, chase them" },

  { name: "Awwal", quote: "The best time to start is now" },
  {
    name: "Awwal",
    quote: "Learn from yesterday, live for today, hope for tomorrow",
  },
  { name: "Awwal", quote: "Stay true to yourself and your vision" },
  { name: "Awwal", quote: "The secret to getting ahead is getting started" },

  { name: "Awwal", quote: "It's not about the destination, but the journey" },
  {
    name: "Awwal",
    quote: "Hard work beats talent when talent doesn't work hard",
  },
  { name: "Awwal", quote: "The only limit is the one you set yourself" },
  { name: "Awwal", quote: "You can do it" },
];

function displayQuotes() {
  quotes.innerHTML = `
    ${quoteList.map(
      (word) => `
    <div class="quote">
    ${word.quote}
    <span class="name">
    -${word.name}
    </span>
    </div>
    `
    )}
    `;
}
function getObjectStore(store_name, mode) {
  var tx = db.transaction(store_name, mode);
  return tx.objectStore(store_name);
}

/**
 * @param {IDBObjectStore=} store
 */

function createDb() {
  console.log("Opening db");
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  // on upgrade needed
  request.onupgradeneeded = (e) => {
    db = e.target.result;
    console.log("openDb.onupgradeneeded");
    var store = evt.currentTarget.result.createObjectStore(DB_STORE_NAME, {
      keyPath: "id",
      autoIncrement: true,
    });

    store.createIndex("body", "body", { unique: true });
    store.createIndex("title", "title", { unique: false });
  };
  // on sucess
  request.onsuccess = (e) => {
    db = e.target.result;
    const transaction = db.transaction("personal-quotes", "readonly");
    const objectStore = transaction.objectStore("personal-quotes");
    objectStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const data = cursor.value;
        const listItem = document.createElement("div");
        listItem.innerHTML = `
        <div class="quote">
        ${data.text}
        <span class="name">
        -${data.title}
        </span>
        </div>
        `;

        document.getElementById("yourQuotes").appendChild(listItem);
        cursor.continue();
      }
    };
  };

  // on error

  request.onerror = (e) => {
    alert(`error is called ${e.target.error}`);
  };
}

function addNote(name, quote) {
  const note = {
    title: name,
    text: quote,
  };
  const tx = db.transaction("personal-quotes", "readwrite");
  const pNotes = tx.objectStore("personal-quotes");
  pNotes.add(note);
}
function displayPubList(store) {
  console.log("displayPubList");
  if (typeof store == "undefined")
    store = getObjectStore(DB_STORE_NAME, "readonly");

  var pub_list = $("#yourQuotes");
  // pub_list.empty();
  // Resetting the iframe so that it doesn't display previous content

  var req;
  req = store.count();
  // Requests are executed in the order in which they were made against the
  // transaction, and their results are returned in the same order.
  // Thus the count text below will be displayed before the actual pub list
  // (not that it is algorithmically important in this case).

  req.onerror = function (evt) {
    console.error("add error", this.error);
  };

  var i = 0;
  req = store.openCursor();
  req.onsuccess = function (evt) {
    var cursor = evt.target.result;

    // If the cursor is pointing at something, ask for the data
    if (cursor) {
      console.log("displayPubList cursor:", cursor);
      req = store.get(cursor.key);
      req.onsuccess = function (evt) {
        var value = evt.target.result;
        var list_item = $(
          "<div class='quote'>" +
            "<span class='name'>" +
            value.title +
            "</span>" +
            "</div>"
        );
        {
          pub_list.append(list_item);
        }

        // Move on to the next object in store
        cursor.continue();

        // This counter serves only to create distinct ids
        i++;
      };
    }
  };
}
submit.onclick = (e) => {
  // e.preventDefault()

  addNote(name_of_quote.value, text.value);
};
var modal = document.getElementById("modal");
var span = document.getElementsByClassName("close")[0];
var btn = document.getElementById("addYours");
btn.onclick = () => {
  modal.style.display = "flex";
};
span.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};
displayQuotes();
createDb();
displayPubList();
