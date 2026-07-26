const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('../src/models/User');

test('registering a user hashes the password and stores the account', async () => {
  
  await mongoose.connect(process.env.MONGODB_URI);

  try {
    const email = `regtest-${Date.now()}@example.com`;
    const user = await User.create({
      name: 'Test User',
      email,
      password: 'password123',
    });

    assert.ok(user._id);

    const savedUser = await User.findById(user._id).select('+password');
    assert.ok(savedUser);
    assert.notEqual(savedUser.password, 'password123');
    assert.equal(await savedUser.comparePassword('password123'), true);

    await User.deleteOne({ _id: user._id });
  } finally {
    await mongoose.disconnect();
  }
});
