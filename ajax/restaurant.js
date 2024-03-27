
const makeFetch = async (url) => {
  const result = await fetch(url)

  return await result.json()
}

const fetchRestaurants = async () =>
  await makeFetch("https://10.120.32.94/restaurant/api/v1/restaurants")

const fetchDailyMenu = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`)


const sortRestaurants = (restaurants) => {
  restaurants.sort((a, b) =>
    a.name
      .toLowerCase()
      .trim()
      .localeCompare(b.name.toLowerCase().trim())
  )
}

const createPhoneLink = (phone) => {
  const cleanedNumber = phone.replaceAll(" ", "").replace(/[a-zA-Z-]+/g, "")

  return `<a href="tel:${cleanedNumber}">${cleanedNumber}</a>`
}

const createDialog = (restaurant, dialogNode, menu) => {
  // ternary operator
  const phone = restaurant.phone !== "-" ? createPhoneLink(restaurant.phone) : ""

  dialogNode.innerHTML = `
    <h1>${restaurant.name}</h1>
    <p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
    <p>${restaurant.company} ${phone}</p>

    <p><a href="mailto:juha.tauriainen@metropolia.fi">laita mailia</a></p>

    <ul>
    ${menu.courses.map(({name, price, diets}) => `<li>${name} - ${price} (${diets.join(", ")})</li>`).join("")}
    </ul>

    <form method="dialog">
      <button>Sulje</button>
    </form>
  `

  dialogNode.showModal()
}

const handleTableRowClick = async (tr, restaurant, dialogNode) => {
  document.querySelectorAll("tr").forEach((tr) => {
    tr.classList.remove("highlight")
  })

  tr.classList.add("highlight")

  const menu = await fetchDailyMenu(restaurant._id)
  console.log("menu", menu)

  createDialog(restaurant, dialogNode, menu)
}

const createTable = (restaurants) => {
  const tableNode = document.querySelector("table")
  const dialogNode = document.querySelector("dialog")

  restaurants.forEach((restaurant) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `<td>${restaurant.name}</td><td>${restaurant.address}</td>`
    tableNode.appendChild(tr)

    tr.addEventListener("click", () => {
      handleTableRowClick(tr, restaurant, dialogNode)
    })
  })
}

const buildWebsite = async () => {

  const restaurants = await fetchRestaurants()
  sortRestaurants(restaurants)

  createTable(restaurants)
}

buildWebsite()