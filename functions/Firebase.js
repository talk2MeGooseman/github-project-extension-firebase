'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.

saveGithubInfo = saveGithubInfo;exports.





setSelectedRepos = setSelectedRepos;exports.










getSelectedRepos = getSelectedRepos;exports.
















getBroadcasterInfo = getBroadcasterInfo;var _Constants = require('./Constants');async function saveGithubInfo(db, data, decoded) {var saveRef = db.collection(_Constants.BROADCASTER_COLLECTION);saveRef.doc(decoded.channel_id).set(data);}async function setSelectedRepos(db, selected_repos, decoded) {var saveRef = db.collection(_Constants.BROADCASTER_COLLECTION);await saveRef.doc(decoded.channel_id).set({ selected_repos: selected_repos }, { merge: true });return getBroadcasterInfo(db, decoded.channel_id);}async function getSelectedRepos(db, channel_id, selected_repos) {var channelRef = db.collection(_Constants.BROADCASTER_COLLECTION).doc(channel_id);try {const doc = await channelRef.get(); // returns promise till data is resolved
    const userData = await doc.data();} catch (error) {console.log(error);return null;}return userData.selected_repos.map(repo_id => {return userData.repos.find(repo => repo.id === repo_id);});}async function getBroadcasterInfo(db, channel_id) {const channelRef = db.collection(_Constants.BROADCASTER_COLLECTION).doc(channel_id);
  try {
    const doc = await channelRef.get();
    // returns promise till data is resolved
    return doc.data();
  } catch (error) {
    console.log(error);
    return null;
  }
}