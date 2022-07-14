const fs = require("fs");

const getAge = (birthDate) =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
const getBirthDay = (age) => {
  const today = new Date();
  return today.getFullYear() - age;
};
const uniqueEmail = (email) => {
  const index = users.findIndex((user) => user.email === email);
  if (index > -1) {
    return false;
  } else return true;
};
const persistData = (users) => {
  fs.writeFile(
    `${__dirname}/../data/users.json`,
    JSON.stringify(users),
    (err) => {
      if (err) throw err;
    }
  );
};

const valideEmail = (email) => {
  let emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

const users = JSON.parse(fs.readFileSync(`${__dirname}/../data/users.json`));

exports.getAllUsers = (req, res) => {
  const changedData = users.map((item) => ({
    id: item.id,
    age: getAge(item.birthday),
    full_name: `${item.first_name} ${item.last_name}`,
    email: item.email,
  }));
  console.log(process.env.npm_lifecycle_event);
  var isInTest = typeof global.it === "test";
  console.log(isInTest);

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users: changedData,
    },
  });
};

exports.getUser = (req, res) => {
  console.log(req.params);
  const id = req.params.user_id;
  const user = users.find((el) => el.id === id);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
  const changedUser = {
    id: user.id,
    age: getAge(user.birthday),
    full_name: `${user.first_name} ${user.last_name}`,
    email: user.email,
  };

  res.status(200).json({
    status: "success",
    data: {
      user: changedUser,
    },
  });
};

exports.createUser = (req, res) => {
  const newId = users.length + 1;
  console.log(req.body.email);
  console.log(valideEmail(req.body.email));
  if (!uniqueEmail(req.body.email)) {
    return res.status(500).json({
      status: "fail",
      message: "Email not unique",
    });
  }

  if (!valideEmail(req.body.email))
    return res.status(400).json({
      status: "fail",
      message: "Email not valid",
    });

  const newUser = Object.assign(
    { id: "A" + newId },
    { first_name: req.body.first_name },
    { last_name: req.body.last_name },
    { email: req.body.email },
    { password: req.body.password },
    { birthday: getBirthDay(req.body.age).toString() }
  );
  users.push(newUser);
  persistData(users);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

exports.deleteUser = (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.user_id);
  if (index > -1) {
    users.splice(index, 1);
    console.log(users);
    persistData(users);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } else {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.updateUser = (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.user_id);
  if (index > -1) {
    if (!uniqueEmail(req.body.email)) {
      return res.status(500).json({
        status: "fail",
        message: "Email not unique",
      });
    }
    if (!valideEmail(req.body.email))
      return res.status(400).json({
        status: "fail",
        message: "Email not valid",
      });

    const updatedUser = Object.assign(
      { id: req.params.user_id },
      { first_name: req.body.first_name },
      { last_name: req.body.last_name },
      { email: req.body.email },
      { password: req.body.password },
      { birthday: getBirthDay(req.body.age).toString() }
    );

    users[index] = updatedUser;
  }
  persistData(users);

  res.status(200).json({
    status: "success",
    data: {
      user: users[index],
    },
  });
};
