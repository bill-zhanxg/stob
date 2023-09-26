const Distube = require('distube');
const { MessageEmbed } = require("discord.js");
const { format } = require("./functions");

module.exports = async (client) => {
    client.distube = new Distube(client, {
        emitNewSongOnly: false,
        highWaterMark: 1024 * 1024 * 64,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        searchSongs: false,
        youtubeDL: true,
        updateYouTubeDL: true,
        youtubeCookie: "GPS=1; YSC=c9lDqjZZ1uQ; VISITOR_INFO1_LIVE=2NBztbdkBjA; PREF=f4=4000000&tz=Australia.Sydney; SID=EwjR3W9x269iEbt0yK30cW7TOIdQmlP1BRdmccFWpG_y9BHsc5DCwg8MDdBxAFOkcp46JA.; __Secure-1PSID=EwjR3W9x269iEbt0yK30cW7TOIdQmlP1BRdmccFWpG_y9BHs9AsURPAX2Outqbp_Qg9mkQ.; __Secure-3PSID=EwjR3W9x269iEbt0yK30cW7TOIdQmlP1BRdmccFWpG_y9BHsnQo13Y5r_Xf3mwjQe-8evg.; HSID=AmqLOGTnyzGmcPYh1; SSID=AYCTaXrCT-IbnVgBK; APISID=rVnMd2NXf_4Gl1dV/AMFbTuIp2fgHWco5e; SAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; __Secure-1PAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; __Secure-3PAPISID=Js_VzPCofVgWLaNN/AJTgSoGHauqeEEZeI; LOGIN_INFO=AFmmF2swRgIhAN4zTMvq0IDIOPl4cJdtSrv3-Np2S6yQQJ24FhBHXn7hAiEApOmTYSwUihr6V-ZPxOdVCqTy_e9V6XcKkpsLULcyvA4:QUQ3MjNmemQ5LXlxUnIzeVFJa0ZoeHI2bXlQUWU1aVFvQmt3aWRrcGJPb0ZiSk1VVHhBYmJoWFhld1EwamdNWjlvcUZlVnRaOEJkY3V5SHNwQ2xCVEdKSzYzczQ3SUMzc29vVUdNMTBwYzFlTjAtNnVXMzRkRTIxNmhoUlRDUUllS01fNHA3ZnZ3M1NObVBQTmh5WFdUT0xrOUxpWmlYQTdB; CONSISTENCY=AGDxDePc0JGrqpEm5camwMuBvHKgEdQH5q93U9ni4HQajRNJlG7-1ITAS_fGpk98N4sH6lx5lkAI_tWA9vyxwjRnRMUvRAM57xv_VzcXJn5zNZHS_U9UnNbtgduCZC3JMvvJ68vPVoQ5zLiG1zm-6jssmu7x2lckqYPoYdCdEkCx8dIFuOfk9uW7Ldh1QqVWIGUHJlo-3NZjMNN2X_Mhow; SIDCC=AJi4QfE5cVwwn1L6kPH5viH8ORKCHHZI534a948Ru22FIrKIHj6rIOziWLydg9kJqwPJYKyx; __Secure-3PSIDCC=AJi4QfGCGUKin7M_cTAprfM2fZE8irGwbR7LnX0hAJ7NyobNlimTW3T7MOfvgEg4qC1_iiDb_A",
        youtubeIdentityToken: "QUFFLUhqazBQa0dIRmhkTXktVU5ZMXJoLWt6clZaSDh5QXw\u003d",
        customFilters: {
            "clear": "bass",
            "lowbass": "bass=g=3",
            "purebass": "bass=g=3,asubboost,apulsator=hz=0.08",
            "bassboost": "bass=g=15",
            "funny": "bass=g=10,apulsator=bpm=300:timing=bpm:hz=1,asubboost",
        },
    });
}