const moment = require('moment')
const path = require("path");
const PounchDB = require("pouchdb");
const db = new PounchDB(
  path.join(__dirname.replace("\\resources\\app.asar", ""), "eventDB")
);

class DatabaseOps {
  async getAllData() {
    try {
      const res = await db.allDocs({
        include_docs: true
      });
      return res
    } catch (err) {
      console.log(err)
      return { ok: false }
    }
  }

  async add(doc_id) {
    try {
      const res = await db.post(doc_id);
      return res;
    } catch (err) {
      console.log(err);
      return { ok: false }
    }
  }

  async delete(doc_id) {
    try {
      const doc = await db.get(doc_id);
      const res = await db.remove(doc);
      return res
    } catch (err) {
      console.log(err);
      return { ok: false }
    }
  }

  async updateDoneTask(doc_id) {
    try {
      const doc = await db.get(doc_id);
      const res = await db.put({
        _id: doc_id,
        _rev: doc._rev,
        title: doc.title,
        detail: doc.detail,
        start: doc.start,
        time: doc.time,
        status: "done",
        done: moment().format("YYYY-MM-DD hh:mm")
      });
      return res
    } catch (err) {
      console.log(err);
      return { ok: false }
    }
  }

  async deleteBulk(data) {
    var docs = data.map((t) => { return { _id: t._id, _rev: t._rev, _deleted: true } })
    // console.log(docs)
    try {
      const res = await db.bulkDocs(docs);
      return res
    } catch (err) {
      console.log(err);
      return { ok: false }
    }
  }

  async updateDateTask(data) {
    const doc_id = data.id
    const doc_start = data.start
    try {
      const doc = await db.get(doc_id);
      const res = await db.put({
        _id: doc_id,
        _rev: doc._rev,
        title: doc.title,
        detail: doc.detail,
        status: doc.status,
        start: doc_start,
        time: doc.time,
        color: doc.color
      });
      return res
    } catch (err) {
      console.log(err);
      return { ok: false }
    }
  }
}
module.exports = DatabaseOps;
