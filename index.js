const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const Database = require("@replit/database")
const db = new Database()

// Config
const bottoken = process.env['TOKEN']

const gambleMulti = 2
const slotMulti = 3
const coinMulti = 2

const adminrunners = ["0000000000", "1111111111"] //UIDs

const slotColours = {
  1: ":red_circle:",
  2: ":blue_circle:",
  3: ":green_circle:",
  4: ":purple_circle:"
}



// Code

client.on("ready", async () => {
  console.log("Logged in as bot!")
})




client.on("messageCreate", (msg) => {

  //--Splitter
  var cmd = msg.content.split(" ");
  var bcmd = cmd[0].toUpperCase()



  //ping
  if (bcmd === "TPING") {
    msg.reply("Pong")
  }


  //help
  if (bcmd === "THELP") {
    msg.reply("**Key**\n\n[] - Optional\n() - Required\n\n\n**Commands**\n\n*tbal [mention]* - Check your/someone's balance\n*tgamble (coins)* - Gamble coins\n*tgstreak [mention]* - Check your/someone's gamble winstreak\n*tsstreak [mention]* - Check your/someone's slot winstreak\n*thelp* - Open the help menu\n*tslots (coins)* - Run the slot machine!")
  }

  //bal
  if (bcmd === "TBAL") {
    /* Checking if the user has used the bot before, and if they have, it will reply with their
    balance. */
    if (cmd[1] === undefined) {
      db.get(msg.author.id).then(value => {
        if (value === null) {
          msg.reply("You have not used the bot yet!\n Run ``tgamble``!")
        } else {
          msg.reply("You have " + value + " Coins!")
        }
      });
    } else if (msg.mentions.members.first()) {
      uid = msg.mentions.members.first()
      db.get(uid).then(value => {
        if (value === null) {
          msg.reply("They have'nt used the bot yet!")
        } else {
          msg.reply("They have " + value + " Coins!")
        }
      });
    }
  }

  //gamble
  if (bcmd === "TGAMBLE") {
    db.get(msg.author.id).then(value => {
      if (value <= 0) {
        db.set(msg.author.id, 50).then(() => {
          msg.reply("You have been given 50 coins to get unstuck!")
        })
      }
    });
    db.get("ap" + msg.author.id).then(value => {
      if (value === true) {
        if (cmd[1] === undefined) {
          msg.reply("Please bet something!")
        } else {
          db.get(msg.author.id).then(value => {
            if (parseInt(cmd[1], 10)) {
              let bet = Math.abs(parseInt(cmd[1], 10));
              if (value < bet) {
                msg.reply("You don't have enough Coins!")
              } else {
                let game = Math.round(Math.random() * 10) + 1
                if (bet <= 10) {
                  if (game <= 1) {
                    let winnings = bet * gambleMulti
                    msg.reply("You won " + winnings + " Coins!")
                    db.set(msg.author.id, value + winnings).then(() => {
                      db.get("ws" + msg.author.id).then(value => {
                        db.set("ws" + msg.author.id, value + 1).then(() => { });
                      });
                    });
                  } else {
                    db.get(msg.author.id).then(value => {
                      db.set(msg.author.id, value - bet).then(() => {
                        msg.reply("You lost " + bet + " Coins!")
                        db.set("ws" + msg.author.id, 0).then(() => { });
                      });
                    });
                  }
                } else {
                  if (game <= 3) {
                    let winnings = bet * gambleMulti
                    msg.reply("You won " + winnings + " Coins!")
                    db.set(msg.author.id, value + winnings - bet).then(() => {
                      db.get("ws" + msg.author.id).then(value => {
                        db.set("ws" + msg.author.id, value + 1).then(() => { });
                      });
                    });
                  } else {
                    db.get(msg.author.id).then(value => {
                      db.set(msg.author.id, value - bet).then(() => {
                        msg.reply("You lost " + bet + " Coins!")
                        db.set("ws" + msg.author.id, 0).then(() => { });
                      });
                    });
                  }
                }
              }
            } else {
              msg.reply("That's not a number!")
            }
          })
        };
      } else {
        db.set(msg.author.id, 50).then(() => {
          db.set("ap" + msg.author.id, true).then(() => {
            msg.reply("Welcome to The Official Gamble Bot!\nYou have been given 50 coins to start off!\nPlease run the gamble command again.")
            db.set("ws" + msg.author.id, 0).then(() => { });
          });
        });
      }
    });
  }

  // The following 3 commands (add, sub and set) are for bot admins only. You can edit the adminRunners array in the Config for configuring it
  //add
  if (bcmd === "TADD") {
    if (cmd[1] === undefined || cmd[2] === undefined || !msg.mentions.members.first()) {
      msg.reply("Please use the correct syntax\n*command mention amount*")
    } else {
      if (adminrunners.includes(msg.author.id)) {
        let uid = msg.mentions.users.first().id
        db.get(uid).then(value => {
          db.set(uid, value + parseInt(cmd[2], 10)).then(() => {
            msg.reply("Done!")
          });
        });
      }
    }
  }


  //sub
  if (bcmd === "TSUB") {
    if (cmd[1] === undefined || cmd[2] === undefined || !msg.mentions.members.first()) {
      msg.reply("Please use the correct syntax\n*command mention amount*")
    } else {
      if (adminrunners.includes(msg.author.id)) {
        let uid = msg.mentions.users.first().id
        db.get(uid).then(value => {
          db.set(uid, value - parseInt(cmd[2], 10)).then(() => {
            msg.reply("Done!")
          });
        });
      }
    }
  }


  //set
  if (bcmd === "TSET") {
    if (cmd[1] === undefined || cmd[2] === undefined || !msg.mentions.members.first()) {
      msg.reply("Please use the correct syntax\n*command mention amount*")
    } else {
      if (adminrunners.includes(msg.author.id)) {
        let uid = msg.mentions.users.first().id
        db.get(uid).then(value => {
          db.set(uid, parseInt(cmd[2], 10)).then(() => {
            msg.reply("Done!")
          });
        });
      }
    }
  }

  // The next 2 commands are for winstreaks (gstreak and sstreak). The first one (gstreak) is for gamble winstreaks and the second one (sstreak) is for slots winstreaks
  //gstreak
  if (bcmd === "TGSTREAK") {
    if (cmd[1] === undefined) {
      db.get("ws" + msg.author.id).then(value => {
        msg.reply("Your gamble streak is at " + value + " Wins!")
      });
    } else if (msg.mentions.members.first()) {
      uid = msg.mentions.members.first()
      db.get("ws" + uid).then(value => {
        msg.reply("Their gamble streak is at  " + value + " Wins!")
      });
    }
  }


  //sstreak
  if (bcmd === "TSSTREAK") {
    if (cmd[1] === undefined) {
      db.get("sws" + msg.author.id).then(value => {
        msg.reply("Your slots streak is at " + value + " Wins!")
      });
    } else if (msg.mentions.members.first()) {
      uid = msg.mentions.members.first()
      db.get("sws" + uid).then(value => {
        msg.reply("Their slots streak is at  " + value + " Wins!")
      });
    }
  }



  //slots
  if (bcmd === "TSLOTS") {
    if (cmd[1] === undefined) {
      msg.reply("Please bet something!")
    } else {
      let bet = Math.abs(parseInt(cmd[1], 10));

      db.get(msg.author.id).then(value => {
        if (value <= 0) {
          db.set(msg.author.id, 50).then(() => {
            msg.reply("You have been given 50 coins to get unstuck!")
          })
        }
        if (bet > value) {
          msg.reply("You don't have enough Coins!")
        } else {
          if (bet <= 10) {
            db.set(msg.author.id, value - bet).then(() => {
              let num1 = Math.round(Math.random() * 3) + 1
              let num2 = Math.round(Math.random() * 3) + 1
              let num3 = Math.round(Math.random() * 3) + 1

              let res1 = slotColours[num1]
              let res2 = slotColours[num2]
              let res3 = slotColours[num3]

              let winnings = bet * slotMulti

              if (res1 === res2 && res2 === res3 && res1 === res3) {
                msg.reply(res1 + " " + res2 + " " + res3 + "\nYou won " + winnings + " Coins!")
                db.get(msg.author.id).then(value => {
                  db.set(msg.author.id, value + winnings).then(() => { });
                });
              } else {
                msg.reply(res1 + " " + res2 + " " + res3 + "\nYou lost " + bet + " Coins!")
              }
            })
          } else {
            db.set(msg.author.id, value - bet).then(() => {
              let num1 = Math.round(Math.random() * 2) + 1
              let num2 = Math.round(Math.random() * 2) + 1
              let num3 = Math.round(Math.random() * 2) + 1

              let res1 = slotColours[num1]
              let res2 = slotColours[num2]
              let res3 = slotColours[num3]

              let winnings = bet * slotMulti

              if (res1 === res2 && res2 === res3 && res1 === res3) {
                msg.reply(res1 + " " + res2 + " " + res3 + "\nYou won " + winnings + " Coins!")
                db.get(msg.author.id).then(value => {
                  db.set(msg.author.id, value + winnings).then(() => {
                    db.get("sws" + msg.author.id).then(value => {
                      db.set("sws" + msg.author.id, value + 1).then(() => { });
                    });
                  });
                });
              } else {
                msg.reply(res1 + " " + res2 + " " + res3 + "\nYou lost " + bet + " Coins!")
                db.set("sws" + msg.author.id, 0).then(() => { });
              }
            })
          }
        };
      });
    }
  }
})



client.login(bottoken)

// This whole bot was very hard to make, thanks for scrolling all the way down!
// Made by TheThiefingKing in 5 hours and 34 minutes
// Uses Replit DB for data storage
// Thanks!
