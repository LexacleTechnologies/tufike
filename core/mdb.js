Admin.find().exec(function(err, res) {
    if (err) { console.log(err); } else {
        fs.writeFile('./core/mdb/admins.bson',JSON.stringify(res),function(err, resp){
          if(err){console.log(err)}
          else {
            Carbrands.find().exec(function(err, res) {
                if (err) { console.log(err); } else {
                    fs.writeFile('./core/mdb/carbrands.bson',JSON.stringify(res),function(err, resp){
                      if(err){console.log(err)}
                      else {
                        Chat.find().exec(function(err, res) {
                            if (err) { console.log(err); } else {
                                fs.writeFile('./core/mdb/chats.bson',JSON.stringify(res),function(err, resp){
                                  if(err){console.log(err)}
                                  else {
                                    Cms.find().exec(function(err, res) {
                                        if (err) { console.log(err); } else {
                                            fs.writeFile('./core/mdb/cms.bson',JSON.stringify(res),function(err, resp){
                                              if(err){console.log(err)}
                                              else {
                                                Colorcodes.find().exec(function(err, res) {
                                                    if (err) { console.log(err); } else {
                                                        fs.writeFile('./core/mdb/colorcodes.bson',JSON.stringify(res),function(err, resp){
                                                          if(err){console.log(err)}
                                                          else {
                                                            Distress.find().exec(function(err, res) {
                                                                if (err) { console.log(err); } else {
                                                                    fs.writeFile('./core/mdb/distresses.bson',JSON.stringify(res),function(err, resp){
                                                                      if(err){console.log(err)}
                                                                      else {
                                                                        Driver.find().exec(function(err, res) {
                                                                            if (err) { console.log(err); } else {
                                                                                fs.writeFile('./core/mdb/drivers.bson',JSON.stringify(res),function(err, resp){
                                                                                  if(err){console.log(err)}
                                                                                  else {
                                                                                    Favorite.find().exec(function(err, res) {
                                                                                        if (err) { console.log(err); } else {
                                                                                            fs.writeFile('./core/mdb/favorites.bson',JSON.stringify(res),function(err, resp){
                                                                                              if(err){console.log(err)}
                                                                                              else {
                                                                                                Notification.find().exec(function(err, res) {
                                                                                                    if (err) { console.log(err); } else {
                                                                                                        fs.writeFile('./core/mdb/notifications.bson',JSON.stringify(res),function(err, resp){
                                                                                                          if(err){console.log(err)}
                                                                                                          else {
                                                                                                            Payment.find().exec(function(err, res) {
                                                                                                                if (err) { console.log(err); } else {
                                                                                                                    fs.writeFile('./core/mdb/payments.bson',JSON.stringify(res),function(err, resp){
                                                                                                                      if(err){console.log(err)}
                                                                                                                      else {
                                                                                                                        Promo.find().exec(function(err, res) {
                                                                                                                            if (err) { console.log(err); } else {
                                                                                                                                fs.writeFile('./core/mdb/promos.bson',JSON.stringify(res),function(err, resp){
                                                                                                                                  if(err){console.log(err)}
                                                                                                                                  else {
                                                                                                                                    Rate.find().exec(function(err, res) {
                                                                                                                                        if (err) { console.log(err); } else {
                                                                                                                                            fs.writeFile('./core/mdb/rates.bson',JSON.stringify(res),function(err, resp){
                                                                                                                                              if(err){console.log(err)}
                                                                                                                                              else {
                                                                                                                                                Rider.find().exec(function(err, res) {
                                                                                                                                                    if (err) { console.log(err); } else {
                                                                                                                                                        fs.writeFile('./core/mdb/riders.bson',JSON.stringify(res),function(err, resp){
                                                                                                                                                          if(err){console.log(err)}
                                                                                                                                                          else {
                                                                                                                                                            Ride.find().exec(function(err, res) {
                                                                                                                                                                if (err) { console.log(err); } else {
                                                                                                                                                                    fs.writeFile('./core/mdb/rides.bson',JSON.stringify(res),function(err, resp){
                                                                                                                                                                      if(err){console.log(err)}
                                                                                                                                                                      else {
                                                                                                                                                                        Setting.find().exec(function(err, res) {
                                                                                                                                                                            if (err) { console.log(err); } else {
                                                                                                                                                                                fs.writeFile('./core/mdb/settings.bson',JSON.stringify(res),function(err, resp){
                                                                                                                                                                                  if(err){console.log(err)}
                                                                                                                                                                                  else {
                                                                                                                                                                                    Supportchat.find().exec(function(err, res) {
                                                                                                                                                                                        if (err) { console.log(err); } else {
                                                                                                                                                                                            fs.writeFile('./core/mdb/supportchats.bson',JSON.stringify(res),function(err, resp){
                                                                                                                                                                                              if(err){console.log(err)}
                                                                                                                                                                                              else {
                                                                                                                                                                                                Vehicle.find().exec(function(err, res) {
                                                                                                                                                                                                    if (err) { console.log(err); } else {
                                                                                                                                                                                                        fs.writeFile('./core/mdb/vehicles.bson',JSON.stringify(res),function(err, resp){
                                                                                                                                                                                                          if(err){console.log(err)}
                                                                                                                                                                                                          else {
                                                                                                                                                                                                            console.log('backup complete')
                                                                                                                                                                                                          }
                                                                                                                                                                                                        })
                                                                                                                                                                                                    }
                                                                                                                                                                                                })
                                                                                                                                                                                              }
                                                                                                                                                                                            })
                                                                                                                                                                                        }
                                                                                                                                                                                    })
                                                                                                                                                                                  }
                                                                                                                                                                                })
                                                                                                                                                                            }
                                                                                                                                                                        })
                                                                                                                                                                      }
                                                                                                                                                                    })
                                                                                                                                                                }
                                                                                                                                                            })
                                                                                                                                                          }
                                                                                                                                                        })
                                                                                                                                                    }
                                                                                                                                                })
                                                                                                                                              }
                                                                                                                                            })
                                                                                                                                        }
                                                                                                                                    })
                                                                                                                                  }
                                                                                                                                })
                                                                                                                            }
                                                                                                                        })
                                                                                                                      }
                                                                                                                    })
                                                                                                                }
                                                                                                            })
                                                                                                          }
                                                                                                        })
                                                                                                    }
                                                                                                })
                                                                                              }
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                  }
                                                                                })
                                                                            }
                                                                        })
                                                                      }
                                                                    })
                                                                }
                                                            })
                                                          }
                                                        })
                                                    }
                                                })
                                              }
                                            })
                                        }
                                    })
                                  }
                                })
                            }
                        })
                      }
                    })
                }
            })
          }
        })
    }
})
