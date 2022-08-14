module.exports = {
  randomIntNumber(min, max) {
    Math.floor(Math.random() * (max - min + 1))
  },
  async sleep(from, to) {
    return await new Promise(resolve => setTimeout(resolve, 1000 * this.randomIntNumber(from, to)))
  }
}