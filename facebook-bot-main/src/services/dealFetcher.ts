import { categories, Category } from "./categories";
import { Deal } from "./deal";
import { Region } from "./regions";
import { FetchMode } from "./fetchModes";

const { Builder, Browser, By, Key, until, WebDriver } = require("selenium-webdriver")
const chrome = require("selenium-webdriver/chrome")

const headless = true

function generateUrl(category: Category, region: Region, fetchMode: FetchMode): string {
  if (category.all) {
    return `https://www.facebook.com/marketplace/${region.areaID}`;
  } else {
    const sortBy = fetchMode.code.length ? `sortBy=${fetchMode.code}&` : ""
    return `https://www.facebook.com/marketplace/${region.areaID}/search/?query=${category.keyword.replace(' ', '%20')}&exact=false`;
  }
}

const funnyMessages = [
  "Contacting Mark Zuckerberg...",
  "Hacking into the mainframe...",
  "Fetching confidential information...",
  "Injecting SQL...",
  "Filtering out viruses...",
  "Enhance, enhance, enhance!",
  "Leaving \"normal facebook users\" in the dust...",
  "Doing some crazy javascript magic..."
]

function setStatus(fetchStatus: { s: string }, status: string, enableFunny = false) {
  // 2% chance of displaying a funny message :)
  if (enableFunny && Math.random() < 0.02) {
    fetchStatus.s = funnyMessages[Math.floor(Math.random() * funnyMessages.length + 1)]
  } else {
    fetchStatus.s = status
  }
}



async function deleteLoginPromptVariant1(driver: any, timeout: number) {
  try {
    await driver.wait(until.elementLocated(By.css("div.x1n2onr6.x1vjfegm > div.x9f619")), timeout)
    const deleteScript = `
    let divs = [...document.querySelectorAll("div.x1n2onr6.x1vjfegm")].filter(d => d.innerText.toLowerCase().contains("log in"));
    return divs.length && divs[divs.length - 1].remove();`
    await driver.executeScript(deleteScript)
  } catch (_) {}
}

async function deleteLoginPromptVariant2(driver: any, timeout: number) {
  try {
    await driver.wait(until.elementLocated(By.css("div.x1n2onr6.xzkaem6")), timeout)
    const deleteScript = `
    let divs = [...document.querySelectorAll("div.x1n2onr6.xzkaem6")].filter(d => d.innerText.toLowerCase().contains("log in"));
    return divs.length && divs[divs.length - 1].remove();`
    await driver.executeScript(deleteScript)
  } catch (_) {}
}

async function deleteLoginPrompt(driver: any, timeout: number) {
  await Promise.all([deleteLoginPromptVariant1(driver, timeout), deleteLoginPromptVariant2(driver, timeout)])
  await Promise.all([deleteLoginPromptVariant1(driver, 1), deleteLoginPromptVariant2(driver, 1)])
}

async function waitUntilDialogCloses(driver: any, timeout: number) {
  for (let i = 0; i < timeout / 10; i++) {
    try {
      await driver.wait(until.elementLocated(By.css("div.x1n2onr6.xzkaem6")), 10)
    } catch (e) {
      return
    }
  }
  throw new Error("Dialog did not close.")
}

export async function fetchDeals(category: Category, region: Region, fetchMode: FetchMode, amount: number, fetchStatus: { s: string }): Promise<Deal[]> {
  const deals: Deal[] = [];

  if (category.custom) {
    let promises: Promise<Deal[]>[] = []

    const start = 2

    // Fast mode
    // const breaks = [start + 5, categories.length]

    // Battery saver mode
    const breaks = [start + 3, start + 6, categories.length]

    let nextStart = start
    for (const b of breaks) {
      for (let i = nextStart; i < b; i++) {
        const cat = categories[i]
        promises.push(fetchDeals(cat, region, fetchMode, 1, fetchStatus))
      }
      (await Promise.all(promises)).forEach(dealsList => deals.push(...dealsList))

      promises = []
      nextStart = b
    }

    return deals
  }

  setStatus(fetchStatus, `Preparing to fetch ${category.name}...`)

  const options = headless ? (new chrome.Options().headless()) : (new chrome.Options())
  const driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
  try {
    const url: string = generateUrl(category, region, fetchMode);
    console.log(`Fetching ${url}`)
    setStatus(fetchStatus, `Accessing webpage for ${category.name}...`)
    await driver.get(url)
    await driver.manage().window().setRect({ x: 0, y: 0, width: 1920, height: 1060 })

    setStatus(fetchStatus, `Applying fetch settings for ${category.name}...`)

    // Click distance filter
    await driver.wait(until.elementLocated(By.css("div.x87ps6o.x1xmf6yo")), 1000)
    await deleteLoginPrompt(driver, 10);

    const distanceFilterButton = await driver.findElement(By.css("div.x87ps6o.x1xmf6yo"))
    await deleteLoginPrompt(driver, 20);
    await distanceFilterButton.click()

    // Click "Radius" dropdown
    await driver.wait(until.elementLocated(By.css("label.x1ypdohk")), 1000)
    await deleteLoginPrompt(driver, 30);
    await (await driver.findElement(By.css("label.x1ypdohk"))).click()

    // Click "20 km"
    await driver.wait(until.elementLocated(By.css("div.x1i10hfl.xz9dl7a")), 200)
    await deleteLoginPrompt(driver, 10);
    await (await driver.findElements(By.css("div.x1i10hfl.xz9dl7a")))[4].click()

    await deleteLoginPrompt(driver, 10);
    await (await driver.findElement(By.css("div.xjbqb8w[aria-label=\"Apply\"]"))).click() // Click Apply
    // await waitUntilDialogCloses(driver, 1000)
    await deleteLoginPrompt(driver, 500);
    await (await driver.findElement(By.css("div.xqvfhly"))).click() // Click Sort By
    await deleteLoginPrompt(driver, 10);
    await (await driver.findElements(By.css("div.x1lliihq")))[fetchMode.index].click() // Click fetch mode
    await deleteLoginPrompt(driver, 100);

    await (await driver.findElements(By.css("div.xqvfhly")))[3].click() // Click Date Listed
    await (await (await driver.findElements(By.css("div.xb57i2i.xxqldzo")))[3].findElements(By.css("div.x1lliihq")))[1].click()

    setStatus(fetchStatus, `Downloading deals from ${category.name}...`, true)

    for (let i = 0; i < amount; i++) {
      await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
      // Wait 1 second
      await new Promise(r => setTimeout(r, 800));
    }

    setStatus(fetchStatus, "Refreshing...")

    const document = new DOMParser().parseFromString(await driver.getPageSource(), "text/html");

    const div = document.querySelectorAll("div.x78zum5.x1r8uery.xdt5ytf.x1iyjqo2.xs83m0k.x1e558r4.x150jy0e")

    div.forEach((el, key, _) => {
      try {
        const link = el.querySelector('div.x3ct3a4 a.x1i10hfl')?.attributes.getNamedItem("href")?.value
        const imageLink = el.querySelector('img.xt7dq6l.xl1xv1r.x10wlt62.xh8yej3')?.attributes.getNamedItem("src")?.value
        const title = el.querySelector('span.x10wlt62.x1n2onr6')?.textContent
        const price = el.querySelector('span.x193iq5w.xeuugli.x13faqbe.x1vvkbs')?.textContent?.trim().toLowerCase() || "0"
        const location = el.querySelector('span.x1nxh6w3')?.textContent
        if (!link) {
          return
        }
        const deal: Deal = {
          price: price === "free" ? 0 : parseInt(price.replace(/[Cc,$]/g, ""), 10),
          link: "https://www.facebook.com" + link,
          imageLink: imageLink || "",
          title: title || "",
          description: "none",
          location: location || "",
          date: undefined,
          datePosted: "none",
          category: category,
          isNew: false,
        }
        if (deal.price === 143) {
          console.log(`Deleting deal "${title}" because its price is $143.`)
        } else {
          deals.push(deal)
        }
      } catch (exception) {
      }
    })
    // deals.sort((a, b) => a.link.localeCompare(b.link))
    for (let i = deals.length - 1; i >= 1; i--) {
      if (deals[i].link === deals[i - 1].link) {
        deals.splice(i, 1)
      }
    }
    // await driver.quit()
    return deals;
  } catch (e: any) {
    console.error(`Hey! An error has occurred while fetching ${category.name}.\n${e.message}\n${e.stack}`)
    return deals;
  } finally {
    await driver.quit()
  }
}

