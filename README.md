# **AI**nimal :tiger: Zookeeper

A client and server to facilitate observing, interacting with, and managing AI systems in the wild.

As heterogeneous, distributed, and exoitc AI systems (**AI**nimals :tiger:) continue to pervade the real world, it is incrinsingly important to observe, care for, and stay in touch with them. **AI**nimal :tiger: Zookeeper provides a client and server to facilitate this interaction with the following features:

- a cross-platform (iOS, Android, web, desktop) react-native client which allows users to:

- launch, terminate, save, delete of models

- change running state (online training and inference, offline training only, online inference only, paused) of launched models 

- view saved model architecture, parameters, and attributes

- observe, overriding, record, and replaying input modalities, output modalities, activations, and weights

- federate user access to the above features


**TODO** AInimals are only half the story. You need environments as well. It should be easy to provision both.

## **AI**nimal interface

To facilitate the diverse interaction schemes employed in real-world AI systems, **AI**nimal :tiger: Zookeeper expects all models to be supplied in a .zip containing a single pickle `<model_name>.py` along with any other necesary files. The server will look for a `AInimal` class in that file and use it to instantiate the AInimal on the local or on a remote server.

The `AInimal` class should conform to the `ainimal_zookeeper.AInimal` interface:
```python
# AInimal interface
# ainimal_zookeeper/AInimal

class AInimal:

  def __init__(self, save_path: str):
    # initialize the AInimal
    # save_path: path to the directory where the AInimal was saved
    raise NotImplementedError()

  def forward(self, inputs: dict) -> dict:
    # forward inputs through the AInimal
    # inputs: (dict[str, pytree[Tensor]]) of input modalities
    # returns: (dict[str, pytree[Tensor]]) of output modalities
    raise NotImplementedError()

  def train(self, traj: list[timestep]) -> 'b':
    # train the AInimal on a trajectory
    # traj: list of timesteps (dm_env.Timestep TODO get actual name)
    # returns: loss for each batch element in traj after training
    raise NotImplementedError()

  def save(self, path: str) -> None:
    # saves the model and any other necessary files to 
    # a directory at `path`. AInimal Zookeeper will create
    # and zip the directory.
    # path: path to save the AInimal to
    raise NotImplementedError()

  ## TODO put modalities back in

  @property
  def state(self) -> dict:
    # returns: dict of AInimal state: I.E.: Anything you want zookeeper to 
    # be able to inspect, record, and possibly control (e.g.: most recent inputs
    # and outputs, optimizer ema's, hidden layer activations, recurrent state, weights, etc.)
    raise NotImplementedError()
```


## TODO make separate modalities project. Use the modalities definition from the other repo. Make javascript and python definitions. THen make it accessible on pip and npm. 
`modalities.Modality` is used to establish a common human and machine interpretation of a tensor. For example, GIVE AN EXAMPLE HERE.  `ainimal_zookeeper.Modality` objects define a combination of `structure` (flat, set, sequence, grid, or graph), `representation` (binary, categorical, integer, real), and `context` ("natural:text", "computer:screen", or other natural language tag)    

## Client

The client provides a cross platform interface for interacting with one or more Zookeeper servers. You can access the client in several ways:

- Launch the server with the flag `--client` and then navigate to the url that is printed in your local browser or on another device in the same LAN. (This method automatically passes server connection information to the client, so it's faster for local development.)

- From the command line, enter: `python3 -m ainimal_zookeeper.client`. Then navigate to the url that is printed in your local browser or on another device in the same LAN.

- Install `Animal Zookeeper` from the .apk, .ipa, .exe, or .appimage files located under `client/*`. In the future, you will also be able to download the mobile apps directly from the App Store or Play Store.

- (Coming soon:) Visit `https://computatrum.io/ainimal_zookeeper` in your browser.

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