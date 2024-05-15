const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')


router.get('/', (req, res) => {

    // Query text to send to the database (SELECT)
        // Using backticks will be easier since queries often have quotes in them
        // Needs to be the exact SQL that you would write in Postico
    let queryText = `SELECT * FROM "songs";`
    
    // Use pool to make the transaction with the DB
    pool.query(queryText)
        .then((result) => {
            console.log("Result from DB:", result.rows)
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(`Error making query.. '${queryText}'`, err)
            res.sendStatus(500)
        })
});

router.post('/', (req, res) => {
    console.log('req.body', req.body);

    let song = req.body

    // Query Text...

    // ! Dont do the following (interpolation)
    // let queryText = `
    //     INSERT INTO "songs" ("artist", "track",  "published", "rank")
    //     VALUES ('${song.artist}', '${song.track}', '${song.published}', ${song.rank}, );
    // `

    // ! Use parameterization ✅

    let songArray = [song.rank, song.track, song.artist, song.published]
    let queryText = `
        INSERT INTO "songs" ("rank", "track", "artist", "published")
        VALUES ($1, $2, $3, $4);
    `

    // Use the pool to make the transaction
        // pool.query(queryText, [SOME ARRAY OF PARAMETERS])
    pool.query(queryText, songArray)
        .then((result) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            console.log(`Error making query.. '${queryText}'`, err)
            res.sendStatus(500)
        })
});

router.delete('/:id', (req, res) => {
    // NOTE: This route is incomplete.
    console.log('req.params', req.params);
    res.sendStatus(200);
});

module.exports = router;