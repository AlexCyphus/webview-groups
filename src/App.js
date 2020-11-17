import React, { Component } from 'react'
import ActionButton from "./components/ActionButton"
import Category from "./components/Category"
import './App.scss';


const NativeApp = {sendTrackingPoint: (name) => {console.log(name)}} //window.NativeApp

function tp(name){
  if (name == undefined){
    return null
  }
  
  const prefix = "Exp_Grp_"
  name = prefix + name
  NativeApp.sendTrackingPoint(name)
}

const categoryData = {
  srsLrn: {
    title: "Serious learning",
    description: "Find other learners looking to rapidly improve their language skills",
    image: "/emojis/31.svg"
  },
  // relaxedLearning: {
  //   title: "Relaxed learning",
  //   description: "Meet language learners interested in chatting while improving their language skills.",
  //   image: "/emojis/32.svg" 
  // },
  jstChat: {
    title: "Just chatting",
    description: "Meet and chat with Tandem members from all over the world.",
    image: "/emojis/34.svg" 
  },
  hbbyInts: {
    title: "Hobbies and interests",
    description: "Find out what people do for fun around the globe.",
    image: "/emojis/30.svg" 
  },
  tndPair: {
    title: "Tandem Pair",
    description: "Join a group with another English speaker and two Spanish speakers.",
    image: "/emojis/33.svg" 
  }
}


const chatData = {
  srsLrn: ["Grammar tips", "Useful vocab + phrases", "Pronounciation help", "Learning resources"],
  relaxedLearning: ["What are your favorite ways to learn?", "Learning tips", "Big group Tandem", "Book recommendations"],
  jstChat: ["How's your day?", "Introduce yourself!", "What is the meaning of life?", "Gossip"],
  hbbyInts: ["Sports", "TV Shows", "Music", "Exploring nature"]
}

// should randomize these here to prevent duplicates
const emojis = Array.from({length: 9}, (_, i) => i + 1)
const flags = Array.from({length: 11}, (_, i) => i + 14)
const groupSizes = [6, 11, 22, 105]

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

// random for each
var randomData = {
  screensEmojis: shuffleArray(emojis).slice(0,4),
  screensGroupSizes: shuffleArray(groupSizes)
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      screen: "public",
      popup: false,
      publicGroup: true,
      showsOver: false,
      value: ''
    }
    this.handleScreenChange = this.handleScreenChange.bind(this)
    this.handleBackToPublic = this.handleBackToPublic.bind(this)
    this.togglePopup = this.togglePopup.bind(this)
    this.toggleShowsOver = this.toggleShowsOver.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {}

  handleScreenChange(screen){
    if (this.state.screen == screen){return}
    this.setState({screen})
  }

  handleChange(e){
    console.log('bang')
  }

  handleOpenGroup(group, trackingPoint){
    tp(trackingPoint)
    let screen = "category_" + group
    if (group == "tndPair"){
      return this.toggleShowsOver()
    }
    this.setState({screen})
  }

  handleBackToPublic(trackingPoint){
    tp(trackingPoint)
    this.setState({screen: "public"})
  }

  togglePopup(publicGroup, trackingPoint){
    tp(trackingPoint)
    
    var isPublic = ""

    if (publicGroup){isPublic = true}
    else {isPublic = false}
    
    this.setState({
      publicGroup: isPublic,
      popup: !this.state.popup,
      showsOver: false
    })
  }

  toggleShowsOver(dontPopup=true, trackingPoint){
    tp(trackingPoint)
    tp("SryMsgSeen")
    if(dontPopup){this.togglePopup()}
    this.setState({showsOver: true})
    if(trackingPoint == "CrtPblicChat_Clicked" || trackingPoint == "CrtPrvtChat_Clicked"){
      let privacy = trackingPoint.split("")[7] === "u" ? "Public" : "Private"
      let groupName = document.getElementById("groupName").value
      var xhr = new XMLHttpRequest()
      var url = "https://script.google.com/macros/s/AKfycbyqLtrrzDQWFSrrklsHJ-DxYChynLXTlnrg9tVtNJbZFJUhvDY/exec?groupName="+groupName+"&privacy="+privacy
      xhr.open('GET',url);
      xhr.send();
    }
  }
  
  render() {
    let Screen = () => null

    var arrayOfCategories = shuffleArray(Object.keys(categoryData))

    // if on the public screen
    if (this.state.screen == "public"){
      tp("PublicSeen")
      Screen = () => {return (
        <>
          <div className="row-holder">
            {arrayOfCategories.map(category => {
              let tp = category+"_Clckd"
              return <Category data={categoryData[category]} onClick={() => this.handleOpenGroup(category, tp)} itemType="category"/>
            })
            }
          </div>
          <div className="see-more-holder"><ActionButton text="See more" color="blue" action={() => this.toggleShowsOver(true, "SeeMoreClicked")}/></div>
        </>
      )}
    }

    // if on the private screen 
    else if (this.state.screen == "private"){
      tp("PrivateSeen")
      Screen = () => {return (
        <div className="text-center p-5">
          <p>Looks like you don't have any group chats yet...</p>
          <img src="/emojis/4.svg" className="py-3 private-chat-image"/>
          <div className="mt-3">
            <p className="pb-3">Have some Tandem partners you want to invite to a group chat?</p>
            <ActionButton text="Start a private group chat" color="blue" action={() => this.togglePopup(false, "StrtPrivChat_Clickd")}/>
          </div>
        </div>
      )}
    }

    // if inside a group category
    else if (this.state.screen.split("_")[0] == "category"){
      var category = this.state.screen.split("_")[1]

      var chatsFlags = []


      Screen = () => {return (
        <>
        <div className="category-header d-flex">
          <div className="back-arrow d-flex" onClick={() => this.handleBackToPublic("BckBtn_Clckd")}>
            <img src="/arrow.png" className="arrow m-auto"/>
          </div>
          <div className="category-title-holder">
            <p className="category-title">{categoryData[category].title}</p>
          </div>
        </div>
        <div className="row-holder">
          {chatData[category].map((item, i) => {
            chatsFlags = shuffleArray(flags).slice(0, 4)
            let trackingPoint = category+"_"+item.split(" ")[0].replace(/[^a-zA-Z0-9]/, '')+"_"+randomData.screensGroupSizes[i]
            return <Category data={item} key={i} itemType="chat" randomData={randomData} index={i} chatsFlags={chatsFlags} onClick={() => this.toggleShowsOver(true, trackingPoint)}/>
          })
          }
      </div>
      <div className="create-public-group-holder text-center">
        <div className="m-auto" id="button-holder">
          <p className="pb-2">Want to chat about something else?</p>
          <ActionButton text="Start public group chat" color="blue" action={() => this.togglePopup(true, "StartPublicChat_Clcked")}/>
        </div>
      </div>
      </>
      )}
    }

    let Popup = () => {
      
      if (this.state.showsOver) {
        return (
          <div className={"popup-main px-3 " + (this.state.popup ? "d-block": "d-none")}>
            <p className='text-center create-group-title'>Sorry...</p>
            <p className='text-center py-3'>Tandem groups aren’t quite ready yet. We’ll let you know when they are fully available.</p>
            <ActionButton text="Back to groups" color="blue" specId="back-to-groups" action={() => this.togglePopup(null, "BckToGrps_Clckd")}/>
          </div> 
        )
      }

      return (
        <div className={"popup-main px-3 " + (this.state.popup ? "d-block": "d-none")}>
          <p className='text-center create-group-title'>{this.state.publicGroup ? "Create a public group" : "Create a private group"}</p>
          <p className='text-center'>{this.state.publicGroup ? "Create a group chat that anyone on Tandem with your language pairing can join." : "Create a private group chat and invite your Tandem partners to join."}</p>
          <div className="input-holder">
            <input placeholder="Group name" id="groupName" className="mb-3"></input>
          </div>
          <ActionButton type="submit" text={this.state.publicGroup ? "Create Public Group Chat" : "Create Private Group Chat"} color="blue" specId="create-group-chat" action={() => this.toggleShowsOver(false, this.state.publicGroup ? "CrtPblicChat_Clicked" : "CrtPrvtChat_Clicked")}/>
          <p className="text-center cancel" onClick={() => this.togglePopup(null, "Cancel")}>Cancel</p>
        </div> 
      )
    }

    return (
      <div className="app h-100">
        <Popup/>
        <div className={"overlay w-100 h-100 " + (this.state.popup ? "d-flex": "d-none")} onClick={this.togglePopup}></div>
        {this.state.screen == "public" || this.state.screen == "private" 
        ? <div className="sliding-header d-flex">
          <div className={"tab-slider col-6 text-center bold " + (this.state.screen == "public" ? 'blue' : null)} onClick={() => this.handleScreenChange("public")}><p>Public</p></div>
          <div className={"tab-slider col-6 text-center bold " + (this.state.screen == "private" ? 'blue' : null)} onClick={() => this.handleScreenChange("private")}><p>Private</p></div>
        </div>
        : null}
        <Screen/>
      </div>
    )
  }
}

export default App
