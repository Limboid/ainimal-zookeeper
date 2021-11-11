# AInimal Zookeeper

A client and server to facilitate observing, interacting with, and managing AInimals (pronounced: ay-ni-mals). 

As heterogeneous, distributed, and exoitc AI systems (AInimals) continue to pervade the real world, it is incrinsingly important to stay closer in touch with them. AInimal Zookeeper provides a client and server to facilitate this interaction with the following features:

- a cross-platform (iOS, Android, web, desktop) react-native client which allows users to:

- view saved AInimals and their attributes

- launch, terminate, save, delete, and change running state (online training and inference, offline training only, online inference only, paused) of AInimals

- enable observing, overriding, recording, and replaying input modalities, output modalities, activations, weights, and system health at periodic intervals

- federated user access to the above features


## AInimal interface

AInimal Zookeeper expects all AInimals to be supplied in a .zip containing a single AInimal pickle `<ainimal_name>.py` and any other necesary files. The server will look for a `<AnimalName>` (CamelCase) class in that file and use it to instantiate the AInimal on the local or on a remote server.

The `<AnimalName>` class should conform to the `ainimal.Ainimal` interface:
```python
# AInimal interface
# ainimal/Ainimal

class Ainimal:

  def forward(self, inputs: dict) -> dict:
    # forward inputs through the AInimal
    # inputs: dict of input modalities
    # returns: dict of output modalities
    raise NotImplementedError

  def train(self, traj: list[timestep]) -> 'b':
    # train the AInimal on a trajectory
    # traj: list of timesteps
    # returns: loss for each batch element in traj after training
    raise NotImplementedError

  def save(self, path: str) -> None:
    # save the AInimal to a file
    # path: path to save the AInimal to
    raise NotImplementedError

  @property
  def input_modalities(self) -> dict[str, Modality]:
    # returns: dict of input modalities
    raise NotImplementedError

  @property
  def output_modalities(self) -> dict[str, Modality]:
    # returns: dict of output modalities
    raise NotImplementedError

  @property
  def state(self) -> dict:
    # returns: dict of AInimal state: I.E.: Anything you want zookeeper to 
    # be able to inspect (optimizer ema's, hidden layer activations, 
    # recurrent state, weights, etc.)
    raise NotImplementedError
```

`Modality` is used to establish a common human and machine interpretation of a tensor. For example, GIVE AN EXAMPLE HERE.  `Modality` objects define a combination of `structure` (flat, set, sequence, grid, or graph), `representation` (binary, categorical, integer, real), and `context` ("natural:text", "computer:screen", or other natural language tag)    

## Client

The client provides a cross platform interface for interacting with one or more Zookeeper servers. You can access the client in several ways:

- Launch the server with the flag `--client` and then navigate to the url that is printed in your local browser or on another device in the same LAN. (This method automatically passes server connection information to the client, so it's faster for local development.)

- From the command line, enter: `python3 -m ainimal_zookeeper.client`. Then navigate to the url that is printed in your local browser or on another device in the same LAN.

- Install `Animal Zookeeper` from the .apk, .ipa, .exe, or .appimage files located under `client/*`. In the future, you will also be able to download the mobile apps directly from the App Store or Play Store.

Next connect to a running AInimal Zookeeper server by entering the `server_url` and `server_port`. You may be prompted for a username and password.

## Server

The server can run as a collection of cloud services or as a standalone server.

### Getting Started: GCP

The entire Zookeeper server is composed as a
- storage bucket: for storing recordings and AInimal pickles
- cloud function and API endpoint: for receiving and processing frontend http requests
- kubernetes deployment cluster: for running the AInimal processes

1. For deployment, edit the `server/.env` config file to enable authentication and set limits.

2. Use the gcloud client to deploy the server,
```bash
TODO
```

### Getting Started: Local

The local deployment server is sturctured similarly to the GCP deployment server.
- storage directory: for storing recordings and AInimal pickles
- local server: for receiving and processing frontend http requests
- docker deamon: for running the AInimal processes in docker containers

To deploy locally,
1. Install dependencies:
- docker
- python dependencies:

```bash
cd server
pip install .
```

2. Add AInimal pickles to the `server/ainimals` directory.

3. Run the server:
```bash
cd server
python3 -m ainimal_zookeeper.server  # call with --help for options
```

4. For deployment, edit the `server/.env` config file to enable authentication and set limits.

## TODO

[ ] provide some unified way to specify training routines on the server as well (or make the server able to dispatch training nodes)
[ ] give jupyterlab access to server (no, actually remote_computer_control_nodes should do this)