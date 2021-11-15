
class Agent {

}
TODO
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

  def load(self, path: str) -> None:
    # load a checkpoint into this model instance from `path`
    raise NotImplementedError()

  @property
  def input_modalities(self) -> dict:
    # returns a dictionary of input modalities
    # returns: (dict[str, Modality])
    raise NotImplementedError()

  @property
  def output_modalities(self) -> dict:
    # returns a dictionary of output modalities
    # returns: (dict[str, Modality])
    raise NotImplementedError()

  @property
  def state(self) -> dict:
    # returns: dict of AInimal state: I.E.: Anything you want zookeeper to 
    # be able to inspect, record, and possibly control (e.g.: most recent inputs
    # and outputs, optimizer ema's, hidden layer activations, recurrent state, weights, etc.)
    raise NotImplementedError()