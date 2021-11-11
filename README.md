# AInimal Zookeeper

A client and server to facilitate observing, interacting with, and managing AInimals (pronounced: ay-ni-mals). 

As heterogeneous, distributed, and exoitc AI systems (AInimals) continue to pervade the real world, it is incrinsingly important to stay closer in touch with them. AInimal Zookeeper provides a client and server to facilitate this interaction with the following features:

- a react-native client supporting iOS, Android, web, and desktop interface which allows users to:

- view saved AInimals and their attributes

- launch, terminate, save, delete, and change running state (online training and inference, offline training only, online inference only, paused, etc.) of AInimals

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

The client provides a cross platform interface for interacting with one or more Zookeeper servers.

## Server

The server can run as a collection of cloud services or as a standalone server.

## TODO

[ ] provide some unified way to train on the server as well (or make the server able to dispatch training nodes)
[ ] give jupyterlab access to server (no, actually remote_computer_control_nodes should do this)