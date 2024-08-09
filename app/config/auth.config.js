module.exports = {
  secret: "mervi-secret-key",

  /* usual */
  // jwtExpiration: 3600, // 1 hour
  //jwtRefreshExpiration: 86400, // 24 hours

  /* test */
  jwtExpiration: 60, // 1 min
  jwtRefreshExpiration: 120, // 2 min
};
