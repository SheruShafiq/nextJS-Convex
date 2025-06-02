# Sheru App Library
_A collection of Software by Sheru_

## Currently the App Library Contains the Fowllowing projects
- ### Sauce
_A community driven resource sharing application_
- ### Badge Maker
_A PDF Generating App for the Jalsa Community_
- ### CV APP
_An interactive CV showcasing Sheru_
- ### Parsec status tool (Coming soon)
_A simple tool to see if my remote systems are online, and if not, the ability to remotey start them up and prepare to take connections_
- ### Family guy to sleep app (Coming soon)
_A simple PWA to stream family guy audio to sleep to even when device is on sleep_


---
 ## **ROADMAP**
 1) Move the project to NextJs
 2) Implenent a proper backend using Convex (See more reasoning in the nightmare log)
 3) Parsec status tool
 4) CV APP
 5) Family Guy
 6) New Game...?
---



### Sauce Feature list (outdated)
1. Convinient sharing using shortened links  
2. Stellar and blazing fast resource searching  
3. Points system to promote legitmacy  
4. Completely anonymouse usage  
5. Non comercial  

---

#### Sauce Product properties

##### Must haves
1. **SHARE DATA** (WHAT IS DATA? DATA: {Resource Name, Resource Value, Resource Description})  
2. Data can be evalunted by other users on its legitimacy.  
   `if (Resource === legit) ? upvote : downvote`  
3. Home feed based off of upvotes.  
4. A report button to report inactive resources that were active before  
5. <del>No accounts system. Anyone can make a post without any signup and comment on it as well. Username will be generated automatically and kept track of locally via cookies.</del>  

#### Nice to have
6. Topic based filtering to be able to look up resources with specific assosciations.  
7. Resource requesting.  
8. Feedbased off "Sauces" where audio based is mustard, more explicit is chili etc  


### API(s) I found for the family guy project
- https://vidsrc.me/
- https://embed.su/
- https://vidlink.pro/
- https://vidsrc.icu/
- https://autoembed.cc/
- https://vidsrc.to/

---

## Things I have learned due to this project
1. Being able to use two remotes simultaneously to push to.  
2. How epic JSON server is  
3. You can make a shitty DB out of Vercel cache (And it worked WOOO IT FEELS SO GOOD)!  
4. MUI doesn't let u do OLED black as body BG (You need to tell it how `!important` it is)  
5. For some messed up reason, iOS (as far as I can tell only iOS) scales your website to make font be 16px. In result destroying every formating. Need to put a meta tag on top to stop that.  
6. GitHUB is an excellent file storage system API, it's free, rate limit of 1K and its fast and easy. So db.json is going there.  
7. Render also doesnt persists for free (bitch), so github api it is.  
8. Node has a maximum string length  
9. What are webworkers, progressive web apps and how to do a loading bar  
10. I might not be as good of a dev as I thought I was  
11. I know very little in the grand scheme of things of web app development and should send a formal appology to both Rein and Erik  
12. position sticky requires top to defined  
13. Web workers are cool as shit, but I dont think I'll have another use case anytime soon.
14. Java is a nightmare to deploy
15. Concurency on scale is tuff (suddenly making Erlang so much cooler than it already was)
16. Bash is very strong and exactly is what I thought python would be.


---

## Make‑shift JIRA Board (because why would a single dev make a whole ass board)

<details>
<summary>Click to expand 📋</summary>

2. <del>Creating a post formulier</del>  
3. <del>Post page</del>  
4. <del>create a a comment formulier</del>  
5. <del>MUI theming</del>  
6. <del>Creating the UI proper once all functionality is online</del>  
7. <del>Loaders for litteraly everything and check if all API calls are async</del>  
8. <del>Once I have the loaders, redo the functionality on system to remove any dependency on localdata and make it completely live only.</del>  
9. <del>Make API URLs dynamic from .env to make it easy to deploy</del>  
10. <del>An effecienter way of handeling comments chain, where a comments chain is created inside the post as well to save API calls amount.</del>  
11. <del>Add credits in the footer</del>  
12. <del>URL(ise) the paginated home</del>  
13. <del>Comments don't have like and dilike options yet, not even in data structure</del>  
14. <del>The error snackbar needs to have dev details that can be opened optionally.</del>  
15. <del>Move to typescript (API res body(s) are a nightmare right now withou t types habing no idea what the hell to pass on and what to expect.)</del>  
16. <del>For some reason there's a weird temporary empty array for like a second after mutation</del>  
17. <del>look into service workers</del>  
18. <del>Giphy PROD</del>  
19. <del>Add readmore toggle to descriptions and comments too long. Add a text size limit on displayName</del>  
20. <del>Need to check for overflows on things like posts, comments, resource description etc on giga long texts. Breaks sometimes on mobile it seems.</del>  
21. <del>Overflow issues on home</del>  
22. <del>Upvoted posts and downvoted posts in users object doesnt seem to work as intended</del>  
23. <del>On Post page, user's profile who posted it needs to be implemented</del>  
24. <del>Loaders for commenting, replying</del>  
25. <del>Sorting functionality on Home</del>  
26. <del>BUG: post title is clickable on post page</del>  
27. <del>earch functionality on Home 12.</del>  
28. <del>A user screen that shows all of user's posts, and comments</del>  
29. <del>Create post loader keeps going on live for some reason</del>  
30. <del>The right section of post page will be "other posts from this user" or something</del>  
31. <del>Now that I have giphy prod I can randomly assign media to posts! based off of post title and description!!</del>  
32. <del>[BUG] IN userprofile Page Header is not getting the currentlogged in User data but the user's data of the page</del>  
33. <del>[BUG] In user profile page Comments are not getting their author's username</del>  
34. [Refactor] Giphy API shouldnt be making fetch calls for GIFs every time, but only on creation endpoints  
35. [Feature] Are you sure and provide a reason dialogue on report post.  
36. [Feature] ThreeJS 404 page after basic exams  
37. <del>Categories's PostsID array is also not working as intended</del>  
38. <del>[BUG] Better error handeling when post ID in URL is wrong</del>  
39. [Feature] Add a check if username and password already exist  
40. [Feature] Lazy LOAD (where applicable)  
41. [Feature] MUSIC  
42. [Feature] implementing categorisation with category based pages and filtering  
43. [BUG] Comments chain overflow on mobile  
44. <del>[Feature] Infinite scroll on posts and comments</del>  
45. <del>[Feature] Left bar on home with quick links around the sheru app library</del>  
46. <del>[Expansion] Sheru app library</del>  
47. [Feature] Shareable links of posts  
48. <del>[Security] Backend LIVE server only accepts requests from frontend LIVE server</del>  
49. <del>[Bug not bug?] Posts should technically scroll backup on pagination change, but then again the final idea is infinite scroll so..... idk?</del>  
50. <del>[DB Error] On prod, one of the user's(dev) liked posts array contains ID: 0. Which is non existing. I'll try to see if thats new or always been there. Also the error snckbar is blanco, gotta look into that as well.</del>  
51. [Feature] Edit and delete posts/comments if user is owner or super user  
52. [Feature] Admin dashboard to manage existing categories and such  
53. [Feature] Dont force 3D backdrop, ask user I guess? Or make it a toggle?  
54. [MaybeBUG?] 3D model can just unalive itself if you are on a different tab  
55. [Featuer expansion] Interactions like liking or disliking are locked behind an account system, but posting and commenting isnt.  
56. <del>[Dating crypto app] Track the streets your partner has been to, every relation is more than a relation, its TANGIBLE.</del>  
57. <del>[Feature] PDF generation is blocking UI thread and is slow as shit, move it to either server or something else. The current speed is unacceptable</del>  
58. **New Project!! Remote Parsec activator.**  
   - Uses a random github file as status (so no cold start, aka no delay)  
   - Windows service to ping every hour or so  
   - Webpage to update  
   - SFW and NSFW version with a spread.
59. [BUG] Sauce posts dont have skeleton loading for the GIF if the Giphy API is taking its time. It just shows nothing.

</details>

---

### Environment & Deployment

```bash
# Frontend Server
npm run dev

# .env variables
VITE_BACKEND_URL
VITE_GIPHY_API_KEY
```

```bash
# Backend Server
node index.cjs

# .env variables
GITHUB_SYNC (true | false)
GITHUB_TOKEN
DB_NAME
FRONTEND_URL
```

- **Vercel Prod URL** — <https://sauce-weld.vercel.app/>  
- **Render Backend Prod URL** — <https://saucebackend.onrender.com/>  

---

## Notes of insanity (A log of shit I did, and lost life years over. Think of it as the Caelid of my mind.)

- After multiple hours of scrootny and discovery, I have come to the conclusion, that the problem is in my function and not the makeshift cache backend in vercel cuz it's also breaking in onRender. All be it, onRender does feel a bit more reliable as far as reliablity goes. Need to look into as to why the likes array of user isn't being updated properly.  
- So, after years being take of my life for each export off of badgeMaker. Apparently jsPDF has a bug, the library itself that exports the entire export in a single string, a string so long (when 200+ badges) that node crashes as it exceeds the maximum length. So thank lord, some guy in the tickets made a fork with a fix cuz the bastards themselves refuse to take the PR in.  
- ALSO HOLY SHIT I MANAGED TO MOVE THE WHOLE THING TO TYPESCRIPT  
- I do need to double check some logic, there's too much of "Why would u do that" going on in functions for sauce app.  
- Holy shit balls, figuring out an effecient way to generate DOM elements as PDFs is a bitch. I tried moving the logic to server, as backend languages tend to be multi-threaded and thus capable of doing more compared to abusing the singular UI thread on my browser. But hey, I have some ideas.  
1) **Idea 1:** Lets send the whole DOM over network to the server, that oughta work right? **NOPE.** It's breaking all sorts of styles due to missing inherited styles...  
2) **Idea 2:** Alright, what if I rewrote the whole thing in HTML/CSS in the backend? Inconsistent—so inconsistent compared to what's on the frontend. It's actually embarassing.  
3) **Idea 3:** Okay okay hold on. **PUPPETEER!** Let's have some headless clients running in the backend using Node and—**STFU.** Why the fuck would you just replicate the problem you have in the frontend in the backend?  
- Okay, webworkers. Holy shit. **SO** cool, but my god the use‑cases are far and few between. Regardless, I am extremely happy with the fact that I got ’em working. PDF generation time is almost half when the work is divided on 2 worker threads. All be it, the issue regarding the browser slowing down when the window isn't focused continues, and might only be resolved via Electron. Need to figure that out yet tho.  
- Implemented a nicer Excel input that supports pasting spreadsheet rows and logs all input to the database.  
- **Idea (Hans):** Hans also low key cooked. What if I made an image of the BG once, sent that to backend and let it loop over that image. That would be THE fastest way to generate badges. Some downsides tho—it's not gonna be as accurate, cuz now shit's not calculated anymore.
- Jesus fucking christ, I spent, no kidding. 9 hours. Browsing the web, scrolling documentations of backend frameworks, trying to understand and choose the best one. Holy shit. Id rather have a heel in my kneehole next time, than have to choose a techstack ever again.
Silverlining: I have sources to back up my steamy turds on every backend framework ever. But yeah here's a short summary of my 9 hour journey:
So, in this fucked up adventure through the gullag. My requirements were as fowllows:
1) I want realtime pub/sub connection
2) I want it to be cheap, ideally stick to big ol Zero.
3) I want it to easily deployable (Dont look up how to deploy a JAVA application. Just get take cock and ball torture instead. NEVER ATTEMPT TO DEPLOY A JAVA APPLICATION).
So yeah, with some additional context and requirements reasoning, I started the deep search thing on GPT and started looking into niches myself that GPT usually doesnt consider.
GPT came up with some damn nice options (see the table in the bottom, in the future section.) So I kept arguing back and forth on each of them. Concurency, active connection limit, pricing, scaling. Intergration with React.
Integration with Vercel. Self hosting, cloud provider bla bla. And finnalyy setteled on firestore. Until moments later during a test setup, I realised that Iam gonna have to reuse my nightmare architecture because the DB is NoSQL.
So I switched back to Supabase, because it had more or less the Firebase package, just with SQL. Which then also got dropped moments later because of a miserably low concurrent user limit and cheapo free tier.
So I finnalyy caved and went with Convex. Even though its NoSQL, since it doesnt charge per query. My data assembly costs should stay down. It works wonders with React (almost made for it), and is supa easy to deploy.
Currently playing around with it in another repo. As soon as I have the API(s) live, then I'll start the migration fully.

---

# Future

**26/05/2025**  
After a lot, and I mean **ALOT**, of research and stressing ChatGPT deep‑research to its limits—and driving a guy on Stack Overflow to the top of Burj Khalifa with questions—I have decided to make two drastic changes:  
- Move the app to **Next.js**  
- <del>Use Google's **Firestore**</del> NEVER THE FUCK MIND. IT doesnt have joins. DO you have any idea the sheer amounts of reads I'd have to do for a single user scrolling for 10 minutes on a nonSQL db? TOO MANY.
- Use Convex as backend

### My reasoning

The following were the contenders for the potential backend.

| # | Option | Why? | Why not? |
|---|--------|------|----------|
| 1 | Java (Spring Boot) | Would be a great learning experience, plus it aligns nicely with my uni stuff. Plenty of libraries to work with. Fast as they come. | It's a nightmare to host. I would rather have heels in my kneehole than attempt to host a Java application ever again. |
| 2 | Phoenix LiveView | Because it's cool as all hell. As far as I can tell, the best backend framework as far as typical backend frameworks go. And of course, **BEAM**. | LiveView is cool as shit but it's not React. It's simply too niche to learn. |
| 3 | Convex | Works excellently with React. Doesnt charge per read or write but CPU sost per query, so I can get away with multiple queries as long as they are lightweight... compared to firestore, which charges per query. Literally the **DREAM** backend framework from what I can tell. Very cool code‑based everything. | Same problem as LiveView—too niche. And the company is going in a weird direction with the whole AI hype. I would love to use it for something else at some point. But yeah... I'm realising I don't have a very good reason to say no. So my reason is that the vibes <del>are</del> were off. WE ARE ON BABAAYYY |
| 4 | Supabase | Modern DB solution. Has all the fancy bells and whistles. Realtime as well—very cool and poggies in all regards. | **MAXIMUM REALTIME CONCURRENT CONNECTIONS ON FREE TIER IS 200. WHICH IS FINE. CUZ AT LEAST IT HAS SQL.** Too expensive tho. Convex is cheaper.  |
| 5 | Firebase | Supabase but **better** | Vendor lock. (Who cares???? Not me.) AND THE FACT THAT ITS NoSQL Makes it COMPLETELY useless for a social media app on scale. |

<del>So yeah. That's why Firebase. It's also, yk, Google. So the knowledge value is waaay higher than Convex.</del>
Nope nope nope nope NOPE. Good god. What was I thinking. 
Anyway now its between Supabase and convex. So yeah lets see.
I have seen; I am going with Convex. It simply makes too much sense. The pricing is better. The DX is more fun. Yes, I probably wont be using it for work anytime soon. But good god its good.

As for wtf is up with Next.js? React is perfectly fine, right?  
Well... There are **a lot** of really nice features that I would otherwise have to implement myself:

- SSR / SSG  
- Image optimisation  
- Never having to expose server‑side logic, etc.  

It just makes no sense to skip on all of that when it's figured out **out of the box**.  
Plus security, scalability, etc.

So yeah—**Next.js** and <del>**Firestore**</del> Convex are the backend stack I have settled on for now. Will start working on migration to NextJs right away via a test project. Get my hands warmed up. And the will attempt to move this project.

---

**26/04/2025–13/05/2025 [DONE]**  
I am far too happy with the setup of this website—the frontend, I mean. So happy, in fact, that I want to make it an Apps library, where Sauce and badgeMaker are two of the apps.  
I want to be able to host all sorts of apps here: my own CV with a GIF for a pfp like those Harry Potter newspapers, any tool I need (like a PasteBin or something), or just anything cool really—whatever tools I use on a regular basis—and then make a full‑fledged little web app store of apps of my own.

---

#### Yes. Sauce is inspired by the *six‑digit sauce*.
