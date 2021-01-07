import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "../../Styles/Card.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Jumbotron,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  CardHeader,
  Container,
  Card
} from "reactstrap";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import SearchFilterModal from "./modals/SearchFilterModal";

export const ProfileCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const [profiles, setProfiles] = useState({ profiles: [] });

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function fetchData() {
      try{
        const result = await axios(`/match/${user.id}`,  { cancelToken: source.token });
        setProfiles(result.data);
      }
      catch(err){
        if (axios.isCancel(err)) {
        }
      }
    }
    if (user){
      fetchData();
    }
    return () => {
      source.cancel();
    };
  }, [user]);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === profiles.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? profiles.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  return(
    auth.user ? 
    (profiles[0] ? (
      <Fragment>
      <SearchFilterModal/>
      <Container>
        <Card className="rounded-lg text-center" style={{background:"#222", borderColor: "black"}}>
        <CardHeader className="text-white" style={{borderColor: "black", background:"#111"}}>Recommended Matches</CardHeader>
          <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            <CarouselIndicators items={profiles} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {profiles.map((profile) => {
              return (
                  <CarouselItem
                    onExiting={() => setAnimating(true)}
                    onExited={() => setAnimating(false)}
                    key={profile.id}
                  >
                    <Link to={"/profile/" + profile.id} key={profile.id}>
                      <img  style={{height: 500, width: "100%", objectFit: "contain", justifySelf: "center"}} src={profile?.profilePic?.picUrl} alt="" />
                      <CarouselCaption captionText={profile.bio} captionHeader={profile.username} />
                    </Link>
                  </CarouselItem>
              );
            })}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
          </Carousel>
        </Card>
      </Container>

      </Fragment>
    ) : (<SearchFilterModal/>)) : (
      auth.isLoading ? (
        <div className="loader"></div>
      ):(

        <Jumbotron>
          <h1>Welcome to Matcha!</h1>
          <p><LoginModal asText="true"/> or <RegisterModal asText="true"/> a new account to begin!</p>
        </Jumbotron>
        )
    )
  )
};
