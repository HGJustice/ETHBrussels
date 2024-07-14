import CreateUser from './components/CreateUser';
import CreateMusicFile from './components/CreateMusicFile';
import CreateStakingPool from './components/CreateStakingPool';
import UserStake from './components/UserStake';
import GainAccess from './components/GainAccess';
export default function App() {
  return (
    <>
      <h1>EthBrussels</h1>
      <w3m-button />
      <h3>Create User 1</h3>
      <CreateUser />
      <h3>Create Music File 2</h3>
      <CreateMusicFile />
      <h3>Create StakingPool for File 3</h3>
      <CreateStakingPool />
      <h3>Fan comes and stakes for listening rights for the song 4</h3>
      <UserStake />
      <h3>
        Once staking target is reached, users can request access to music file 5
      </h3>
      <GainAccess />
    </>
  );
}
