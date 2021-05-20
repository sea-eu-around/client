import {uniqueId} from "lodash";
import {Gender} from "./constants/profile-constants";
import {ChatRoom, ChatRoomMessage, ChatRoomUser} from "./model/chat-room";
import {UserProfile} from "./model/user-profile";

/* 
let urls = [];
function onlyUnique(value, index, self) {return self.indexOf(value) === index;}

let imgs = Array.from(document.getElementsByClassName("_2UpQX"));
urls = urls.concat(imgs.map((img) => img.getAttribute("src")));
urls = urls.filter(onlyUnique)
console.log("Unique URLs:", urls.length);

urls
*/

const scrapedAvatars = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    // "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cG9ydHJhaXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1515023115689-589c33041d3c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1519895609939-d2a6491c1196?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1509460913899-515f1df34fea?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1506468203959-a06c860af8f0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzl8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1450297350677-623de575f31c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1493106819501-66d381c466f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1499651681375-8afc5a4db253?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzV8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1525550557089-27c1bfedd06c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    "https://images.unsplash.com/photo-1541779408-c355f91b42c9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDh8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1516756587022-7891ad56a8cd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjV8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1570158268183-d296b2892211?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1521227889351-bf6f5b2e4e37?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDF8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1509305717900-84f40e786d82?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDl8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1514846326710-096e4a8035e0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1502980426475-b83966705988?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTV8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTl8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1520409364224-63400afe26e5?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjV8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Njh8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1486074051793-e41332bf18fc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTF8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1579295560051-3df968edb036?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1514794749374-fb67509dbb7f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1551843073-4a9a5b6fcd5f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1500832333538-837287aad2b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1592621385645-e41659e8aabe?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjZ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1440133197387-5a6020d5ace2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Njl8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1531727991582-cfd25ce79613?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1520998116484-6eeb2f72b5b9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1568038479111-87bf80659645?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1514626585111-9aa86183ac98?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTZ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1542513217-0b0eedf7005d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTh8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1508185140592-283327020902?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjF8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1492288991661-058aa541ff43?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1526510747491-58f928ec870f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Njd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1514161955277-4ea47eef2ff9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzF8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzV8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1464863979621-258859e62245?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nzd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODF8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1541519481457-763224276691?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    "https://images.unsplash.com/photo-1453396450673-3fe83d2db2c4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1514929781313-76fcbb2136b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1499155286265-79a9dc9c6380?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzZ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1504810370725-2585de12e6ee?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1504834636679-cd3acd047c06?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1516239482977-b550ba7253f2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODZ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1441786485319-5e0f0c092803?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODl8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1439778615639-28529f7628bc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1509670572852-5823184def8c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTZ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1440589473619-3cde28941638?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1492627223639-6e980361988c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nzh8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1534954553104-88cb75be7648?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nzl8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1527047614336-194da60dacd9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODV8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1522874339442-b66b63414ab4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODh8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTF8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1542909192-2f2241a99c9d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTh8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1517374148673-a38e9dd4fe6f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTAxfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1469460340997-2f854421e72f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA0fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&w=1000&q=80",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA3fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1595948486018-39878148ec5b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTEwfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1504275490777-45f30792f13f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTl8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1554425755-85d1309eaeb9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTAyfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1521146764736-56c929d59c83?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA1fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1509868918748-a554ad25f858?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA4fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1525545073321-a0c3bc5f4c1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTExfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1514448553123-ddc6ee76fd52?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE0fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1502452213786-a5bc0a67e963?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTV8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1499399244875-59ef3e1347e3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1474533410427-a23da4fd49d0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTAwfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1532363664322-b46b86cc86d9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTAzfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA2fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1541271696563-3be2f555fc4e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1531986733711-de47444e8cd8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTEzfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1535325019257-3f8a7994a3f3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE2fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1534399315465-2b91232de345?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE5fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1536896407451-6e3dd976edd1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIxfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTI0fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1578863873955-40421002faa6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTI3fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1569210538317-4d53f92a0e21?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTMwfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1610669057941-53c6b567554a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTMzfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1525599428495-0441bd5c67de?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE3fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1575075500178-c99ef905661a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIwfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1514907728441-b33bec65e315?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIzfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1541257710737-06d667133a53?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTI2fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1476638305939-a09cd694566c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTI5fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1578461273189-0950898bd0f2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTMxfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1536766768598-e09213fdcf22?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTM0fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1525299374597-911581e1bdef?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTEyfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1508216404415-a35220fab80e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE1fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTE4fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1590735627513-59a186ed0984?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTI1fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1567393594901-e66aa5e2ec56?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTI4fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1508978644997-53cc5bfb8a03?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTMyfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTM2fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1507260168301-fc94cce6d4d2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTM5fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1489512827632-6e52aecf88bf?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQyfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1531019460266-e2adc2c6bcec?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQ3fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTUwfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1579484777794-68dfd0a4777b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTUzfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1617720409730-18848f7848f5?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTU3fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTM3fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1580046868072-debd27601ae2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQxfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQ1fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1489779162738-f81aed9b0a25?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQ4fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1609175858596-198e97287a07?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQ5fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1568927198336-e9ae04365910?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTUyfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1509650695346-96796d06faf7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTU2fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1495490140452-5a226aef25d4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTU4fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1532076904124-d4e8fe7fbbec?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTM1fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1553514029-1318c9127859?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTM4fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1492447216082-4726bf04d1d1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQwfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1471864167314-e5f7e37e404c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQzfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1544817747-b11e3e3b6ac2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQ0fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1520066078359-507c5a3ca013?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTQ2fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1482555670981-4de159d8553b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTUxfHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1505421031134-e57263cae630?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTU0fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1616428362406-4ffd9fcbf023?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTU1fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1496360784265-52a2509684f3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTU5fHxwb3J0cmFpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
];

// Generated using https://www.name-generator.org.uk/quick/
const names = [
    "Shea Bowes",
    "Lauryn Livingston",
    "Tasmin Bonilla",
    "Zayne Ferry",
    "Wilson Mckinney",
    "Agnes Floyd",
    "Suman Shields",
    "Jun Sexton",
    "Annabell Hollis",
    "Arwen Frame",
    "Aida Lambert",
    "Chloe-Louise Ramos",
    "Fahmida Valenzuela",
    "Rudra Hendrix",
    "Glenn Spencer",
    "Aaryan Edmonds",
    "Bhavik Wood",
    "Gabrielle Todd",
    "Arif Major",
    "Rayyan Coles",
    "Poppy-Rose Dunkley",
    "Izabelle Bell",
    "Kim Seymour",
    "Zainab Hirst",
    "Macey Goodwin",
    "Luke Villarreal",
    "Elsie-Mae Hines",
    "Carolyn Dodson",
    "Mason Talbot",
    "Miriam Leal",
    "Asia Keeling",
    "Akeem Sharples",
    "Sanna French",
    "Mahnoor Jimenez",
    "Qasim Naylor",
    "Ishaan Stott",
    "Dakota Watt",
    "Deon Ahmad",
    "Musab Manning",
    "Idrees Ireland",
    "Bert Dunlap",
    "Falak Irvine",
    "Nabeel Horton",
    "Josie Dodd",
    "Kerrie Andersen",
    "Lewys Tran",
    "Jac Medina",
    "Milton Robertson",
    "Daisie Carney",
    "Alanna Nieves",
    "Kamal Gates",
    "Nigel Delarosa",
    "Amani Welsh",
    "Alicia Munro",
    "Dorian Daniels",
    "Daanyal Burks",
    "Evan Wills",
    "Kaila Park",
    "Ted Lin",
    "Harmony Donnelly",
    "Jodie Boone",
    "Margot Holt",
    "Amin Sweeney",
    "Kelsea Pierce",
    "Mikhail Tapia",
    "Hakeem Firth",
    "Timur Crouch",
    "Briony Gay",
    "Kelly Bates",
    "Lynn Larsen",
    "Darius Mercado",
    "Gino Bull",
    "Callam Callahan",
    "Mateusz Ramsay",
    "Andrew Salas",
    "Luka Davila",
    "Ritik Needham",
    "Tommie Moyer",
    "Suzannah O'Quinn",
    "Aydin Blackmore",
    "Martina Kaye",
    "Barry Ruiz",
    "Gianluca Cantrell",
    "Sameeha Thomas",
    "Isla-Mae Buckley",
    "Colby Smart",
    "Tina Richard",
    "Reyansh Sharpe",
    "Tevin Caldwell",
    "Sameera Hutchinson",
    "Patrick Watkins",
    "Kaison Rawlings",
    "Eryk Reilly",
    "Zaynah Summers",
    "Ashton Hicks",
    "Wilma Reader",
    "Teo Marin",
    "Marcia Milne",
    "Danyal Mcfadden",
    "Layton Miles",
];

const genders: Gender[] = [
    "male",
    "female",
    "female",
    "female",
    "male",
    "female",
    "male",
    "male",
    "female",
    "female",
    "female",
    "female",
    "male",
];

export function getRandomName(): {firstName: string; lastName: string} {
    const fullName = names[Math.floor(Math.random() * names.length)];
    const split = fullName.split(" ");
    return {firstName: split[0], lastName: split[1]};
}

let i = 0;
const savedOutputs: {[key: string]: Partial<UserProfile>} = {};

export function getNextProfileInfo(id: string): Partial<UserProfile> {
    if (!savedOutputs[id]) {
        // const fullName = names[Math.floor(Math.random() * names.length)];
        const fullName = names[i % names.length];
        const splitName = fullName.split(" ");
        const firstName = splitName[0];
        const lastName = splitName[1];

        // const avatarUrl = scrapedAvatars[Math.floor(Math.random() * scrapedAvatars.length)],
        const avatarUrl = scrapedAvatars[i % scrapedAvatars.length];

        const gender = genders[i % genders.length];

        savedOutputs[id] = {firstName, lastName, avatarUrl, gender};

        i++;
    }
    return savedOutputs[id];
}

let j = 0;

export function getNextRoomInfo(r: ChatRoom): Partial<ChatRoom> {
    const users = r.users.map((u: ChatRoomUser) => {
        const p = getNextProfileInfo(u._id);
        return {
            ...u,
            name: p.firstName + " " + p.lastName,
            avatar: p.avatarUrl || "",
        };
    });
    const me = users[0];
    const you = users[1];

    let d = Date.now();
    const msg = (user: ChatRoomUser, text: string): ChatRoomMessage => {
        d += 3.6e6 * 2.5 * Math.random();
        return {
            _id: uniqueId(),
            user,
            sent: true,
            createdAt: new Date(d),
            text,
        };
    };

    const messages = [
        msg(you, "Good morning!"),
        msg(me, "Hi! How are you?"),
        msg(you, "Good! What's up?"),
        msg(me, "Not much, working on the spanish assignment"),
        msg(you, j % 2 === 0 ? "Alright, need help?" : "Okay!"),
    ].reverse();

    const lastMessage = messages[0];

    if (r.lastMessage) j++;

    return {
        ...r,
        users: users.map((u) => ({
            ...u,
            lastMessageSeenDate: lastMessage.createdAt,
            lastMessageSeenId: lastMessage._id,
        })),
        lastMessage: r.lastMessage ? lastMessage : null,
        messages,
        messagePagination: {canFetchMore: false, page: 1, fetching: false},
    };
}
