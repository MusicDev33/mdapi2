# Xenon Data Pipeline

Xenon will automatically parse websites (or at least it will do the best it can), and then save the result. The result of Xenon parsing the data is going to be known
as the 'raw' data. When a human edits the raw data into something clean and presentable, this is known as 'clean' data.

Basically, when you request a site from Xenon, it will follow this procedure:

1. Check if raw or cleaned data exists in the DB
2. If it does, send the existing data, if not, go to next step
3. Get website data (just pull the HTML straight from the internet)
4. Attempt to parse the website data
5. Save data to DB
