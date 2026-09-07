

export const CATEGORIES = [
  {
    slug: "fiction",
    label: "Fiction",
  },
  {
    slug: "science",
    label: "Science",
  },
  {
    slug: "story",
    label: "Story & Folktale",
  },
  {
    slug: "mystery",
    label: "Mystery & Thriller",
  },
];

const raw = [
  // ---------- Fiction ----------
  { title: "Pride and Prejudice", author: "Jane Austen", category: "fiction", isbn: "9780141439518", price: 349, mrp: 499, rating: 4.7, blurb: "A sharp, funny account of the Bennet sisters navigating marriage, money and misjudged first impressions in Regency England." },
  { title: "To Kill a Mockingbird", author: "Harper Lee", category: "fiction", isbn: "9780061120084", price: 399, mrp: 549, rating: 4.8, blurb: "A small Alabama town, a wrongful trial, and a young girl's coming-of-age told through her father's quiet courage." },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "fiction", isbn: "9780743273565", price: 349, mrp: 479, rating: 4.4, blurb: "A mysterious millionaire, a lost love, and the hollow glitter of the Jazz Age on Long Island." },
  { title: "Jane Eyre", author: "Charlotte Brontë", category: "fiction", isbn: "9780141441146", price: 399, mrp: 549, rating: 4.6, blurb: "An orphaned governess's journey toward independence, love and a house with a secret in its attic." },
  { title: "Wuthering Heights", author: "Emily Brontë", category: "fiction", isbn: "9780141439556", price: 379, mrp: 519, rating: 4.3, blurb: "A wild, obsessive love story that haunts two families across the Yorkshire moors for generations." },
  { title: "Little Women", author: "Louisa May Alcott", category: "fiction", isbn: "9780147514011", price: 379, mrp: 519, rating: 4.6, blurb: "Four sisters growing up during and after the Civil War, each chasing a different idea of a good life." },
  { title: "Anna Karenina", author: "Leo Tolstoy", category: "fiction", isbn: "9780143035008", price: 549, mrp: 749, rating: 4.5, blurb: "A tragic affair set against the wider canvas of marriage, family and society in Imperial Russia." },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky", category: "fiction", isbn: "9780143058144", price: 499, mrp: 679, rating: 4.5, blurb: "A destitute former student commits a murder he believes is justified — and then can't live with it." },
  { title: "Moby-Dick", author: "Herman Melville", category: "fiction", isbn: "9780142437247", price: 499, mrp: 679, rating: 4.1, blurb: "Captain Ahab's obsessive hunt for the white whale that took his leg, narrated by the one sailor who lives to tell it." },
  { title: "Frankenstein", author: "Mary Shelley", category: "fiction", isbn: "9780141439471", price: 329, mrp: 449, rating: 4.4, blurb: "A scientist's creation turns against him, raising uncomfortable questions about ambition and responsibility." },

  // ---------- Science ----------
  { title: "A Brief History of Time", author: "Stephen Hawking", category: "science", isbn: "9780553380163", price: 449, mrp: 599, rating: 4.6, blurb: "A plain-language tour of black holes, the Big Bang and the nature of time itself, from one of physics' great minds." },
  { title: "Cosmos", author: "Carl Sagan", category: "science", isbn: "9780345539434", price: 499, mrp: 679, rating: 4.7, blurb: "A sweeping journey through the universe and the history of science, written with unmatched sense of wonder." },
  { title: "The Selfish Gene", author: "Richard Dawkins", category: "science", isbn: "9780198788607", price: 469, mrp: 629, rating: 4.4, blurb: "A landmark argument for viewing evolution from the gene's point of view, and how it reshapes ideas about behaviour." },
  { title: "Sapiens", author: "Yuval Noah Harari", category: "science", isbn: "9780062316097", price: 549, mrp: 749, rating: 4.6, blurb: "A big-picture history of how Homo sapiens went from foraging bands to the dominant species on Earth." },
  { title: "On the Origin of Species", author: "Charles Darwin", category: "science", isbn: "9780451529060", price: 399, mrp: 549, rating: 4.2, blurb: "The book that introduced natural selection to the world, still readable and startling more than a century later." },
  { title: "Silent Spring", author: "Rachel Carson", category: "science", isbn: "9780618249060", price: 429, mrp: 579, rating: 4.5, blurb: "The investigation into pesticide use that helped launch the modern environmental movement." },
  { title: "The Gene: An Intimate History", author: "Siddhartha Mukherjee", category: "science", isbn: "9781476733500", price: 549, mrp: 749, rating: 4.6, blurb: "A history of genetics woven together with the author's own family story of mental illness." },
  { title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", category: "science", isbn: "9780393609394", price: 399, mrp: 549, rating: 4.5, blurb: "The universe's biggest ideas — from quarks to galaxies — in short chapters built for a busy life." },
  { title: "The Elegant Universe", author: "Brian Greene", category: "science", isbn: "9780393338102", price: 469, mrp: 629, rating: 4.4, blurb: "An approachable guide to string theory and the decades-long search for a theory of everything." },
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "science", isbn: "9780393354324", price: 519, mrp: 699, rating: 4.4, blurb: "A wide-ranging theory of why history unfolded so differently for different peoples across continents." },

  // ---------- Story & Folktale ----------
  { title: "Grimms' Fairy Tales", author: "Jacob & Wilhelm Grimm", category: "story", isbn: "9780553213387", price: 299, mrp: 399, rating: 4.5, blurb: "The classic German folk collection behind Cinderella, Hansel and Gretel, and dozens of darker, lesser-known tales." },
  { title: "Aesop's Fables", author: "Aesop", category: "story", isbn: "9780451529305", price: 279, mrp: 369, rating: 4.4, blurb: "Short animal fables, each carrying a moral, that have shaped storytelling for over two thousand years." },
  { title: "One Thousand and One Nights", author: "Anonymous (trans. Husain Haddawy)", category: "story", isbn: "9780140449389", price: 399, mrp: 549, rating: 4.6, blurb: "Scheherazade's nightly stories-within-stories, told to postpone her execution one tale at a time." },
  { title: "Hans Christian Andersen's Fairy Tales", author: "Hans Christian Andersen", category: "story", isbn: "9780140367077", price: 319, mrp: 419, rating: 4.5, blurb: "The Danish tales behind The Little Mermaid, The Ugly Duckling and The Snow Queen, in their original form." },
  { title: "The Panchatantra", author: "Vishnu Sharma", category: "story", isbn: "9780140455212", price: 349, mrp: 459, rating: 4.6, blurb: "Ancient Indian animal fables originally composed to teach princes statecraft through clever storytelling." },
  { title: "The Jungle Book", author: "Rudyard Kipling", category: "story", isbn: "9780141321037", price: 329, mrp: 439, rating: 4.5, blurb: "Mowgli's upbringing among wolves, bears and a panther in the forests of colonial India." },
  { title: "Just So Stories", author: "Rudyard Kipling", category: "story", isbn: "9780140367121", price: 299, mrp: 399, rating: 4.4, blurb: "Playful origin tales explaining how the leopard got its spots, the camel its hump, and more." },
  { title: "The Blue Fairy Book", author: "Andrew Lang", category: "story", isbn: "9780486210437", price: 289, mrp: 379, rating: 4.4, blurb: "The first of Andrew Lang's famous colour-coded fairy-tale anthologies, gathering stories from across Europe." },
  { title: "Italian Folktales", author: "Italo Calvino", category: "story", isbn: "9780156454896", price: 449, mrp: 599, rating: 4.6, blurb: "Calvino's decade-long project collecting and retelling two hundred folktales from every Italian region." },
  { title: "Jataka Tales", author: "Retold by Nancy DeRoin", category: "story", isbn: "9780876145653", price: 299, mrp: 399, rating: 4.5, blurb: "Birth-story fables of the Buddha in his earlier lives, often as a wise and resourceful animal." },

  // ---------- Mystery & Thriller ----------
  { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", category: "mystery", isbn: "9780451528018", price: 329, mrp: 439, rating: 4.6, blurb: "Sherlock Holmes investigates a family curse and a spectral hound stalking the Devon moors." },
  { title: "A Study in Scarlet", author: "Arthur Conan Doyle", category: "mystery", isbn: "9781503280135", price: 299, mrp: 399, rating: 4.4, blurb: "The novel that first introduced Sherlock Holmes and Dr. Watson, and the strange murder that brought them together." },
  { title: "Murder on the Orient Express", author: "Agatha Christie", category: "mystery", isbn: "9780062073501", price: 399, mrp: 549, rating: 4.6, blurb: "Hercule Poirot must solve a murder aboard a snowbound train where every passenger seems to have a motive." },
  { title: "And Then There Were None", author: "Agatha Christie", category: "mystery", isbn: "9780062073488", price: 399, mrp: 549, rating: 4.7, blurb: "Ten strangers are lured to an island and killed off one by one, each in the manner of an old nursery rhyme." },
  { title: "Rebecca", author: "Daphne du Maurier", category: "mystery", isbn: "9780380730407", price: 419, mrp: 559, rating: 4.6, blurb: "A new bride finds herself haunted by the memory of her husband's mysterious first wife." },
  { title: "Gone Girl", author: "Gillian Flynn", category: "mystery", isbn: "9780307588371", price: 449, mrp: 599, rating: 4.4, blurb: "A wife vanishes on her fifth anniversary, and her husband's version of events starts to unravel." },
  { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", category: "mystery", isbn: "9780307949486", price: 469, mrp: 629, rating: 4.5, blurb: "A disgraced journalist and a fierce young hacker dig into a decades-old disappearance in Sweden." },
  { title: "In Cold Blood", author: "Truman Capote", category: "mystery", isbn: "9780679745587", price: 399, mrp: 539, rating: 4.5, blurb: "A meticulously reported account of a real 1959 murder that helped invent the true-crime genre." },
  { title: "The Silence of the Lambs", author: "Thomas Harris", category: "mystery", isbn: "9780312924584", price: 399, mrp: 539, rating: 4.5, blurb: "A trainee FBI agent turns to an imprisoned cannibal for help catching a serial killer on the loose." },
  { title: "The Da Vinci Code", author: "Dan Brown", category: "mystery", isbn: "9780307474278", price: 399, mrp: 549, rating: 4.2, blurb: "A murder in the Louvre sends a symbologist chasing a centuries-old secret hidden in plain sight." },
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const BOOKS = raw.map((b, i) => {
  const id = `bk-${String(i + 1).padStart(3, "0")}`;
  return {
    id,
    slug: `${slugify(b.title)}-${id}`,
    ...b,
  };
});

export function coverUrl(book) {
  return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
}

export function getBooksByCategory(categorySlug) {
  return BOOKS.filter((b) => b.category === categorySlug);
}

export function getBookBySlug(slug) {
  return BOOKS.find((b) => b.slug === slug);
}

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}