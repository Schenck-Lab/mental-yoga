const level1 = {
  name: 'Cookie',
  title: 'Cookie or Ceekio?',

  intro: (
    <>
      <p>
        <strong>Cookie</strong> is a cheerful cube-shaped cookie who can always
        fold perfectly into a cube.
      </p>
      <br/>
      <p>
        Her sister, <strong>Ceekio</strong>, tries to copy her — but something is
        always off.
      </p>
      <br/>
      <p>
        For each cookie net, decide whether it belongs to Cookie or Ceekio.
      </p>
    </>
  ),

  questionOneLiner: (
    <>
      Use the <b>selection below</b> to decide whether this net is{' '}
      <strong>Cookie</strong> (valid net) or <strong>Ceekio</strong> (invalid net).
    </>
  ),

  hint: (
    <>
      <p>
        A cookie net belongs to Cookie if it can be folded into a
        complete cube without overlaps or gaps.
      </p>
      <p>
        If it cannot form a cube correctly, it belongs to{' '}
        Ceekio.
      </p>
    </>
  ),
};


const level2 = {
  name: 'Cluck',
  title: 'Guess the Other Wing',

  intro: (
    <>
      <p>
        <strong>Cluck</strong> is a friendly little chicken from the farm.
        She doesn't talk much, but she loves visiting the yoga studio and playing
        games with new friends.
      </p>
      <br/>
      <p>
        One of her favorite games is called <em>“Guess the Wing.”</em>
      </p>
      <br/>
      <p>
        Cluck stretches herself into a net and shows you where one wing is.
        Your job is to figure out where her other wing ends up.
      </p>
    </>
  ),

  questionOneLiner: (
    <>
      Select <b>the face in the scene</b> that would be{' '}
      opposite to the marked one when the net is folded into a cube.
    </>
  ),

  hint: (
    <>
      <p>On a cube, opposite faces never touch.</p>
      <p>
        When the net is folded into a cube, the two wings end up on opposite faces.
      </p>
    </>
  ),
};


const level3 = {
  name: 'Pipes',
  title: 'Connected Pipes',

  intro: (
    <>
      <p>
        <strong>Pipes</strong> comes from the old part of town.
        He's built from long, winding sewer pipes, and he enjoys visiting the yoga
        studio to stretch and twist his shape.
      </p>
      <br/>
      <p>
        When Pipes unfolds himself into a net, his pipes spread out in many directions.
        Sometimes, he forgets which pipes are actually connected once he folds back
        into a cube.
      </p>
    </>
  ),

  questionOneLiner: (
    <>
      Select <b>the pipe segment in the scene</b> that{' '}
      connects with the marked one after folding to the cube.
    </>
  ),

  hint: (
    <>
      <p>
        When the net is folded into a cube, some pipe segments meet along the same edge.
      </p>
      <p>
        The marked pipe and the correct one become the same edge on the cube.
      </p>
    </>
  ),
};


const level4 = {
  name: 'Blueb',
  title: "Blueb's Pressure Points",

  intro: (
    <>
      <p>
        <strong>Blueb</strong> is a blue ogre ninja.
        Even though people didn't always believe in him, he traveled far to study
        an ancient pressure-point technique.
      </p>
      <br/>
      <p>
        Blueb loves showing his pressure points to friends at the yoga studio.
        When he stretches himself into a net, he marks one pressure point and asks
        a challenge.
      </p>
      <br/>
      <p>
        Can you find the other two pressure points that are closest to it when he
        folds back into a cube?
      </p>
    </>
  ),

  questionOneLiner: (
    <>
      Select the <b>two pressure points in the scene</b> that are closest
      to the marked one when folded into a cube.
    </>
  ),

  hint: (
    <>
      <p>On a cube, three corners meet at each vertex.</p>
      <p>
        The correct pressure points all come together at the same corner when the
        cube is folded.
      </p>
    </>
  ),
};


const level5 = {
  name: 'Frostra',
  title: "Frostra's Ice Cream Carry",

  intro: (
    <>
      <p>
        <strong>Frostra</strong> is a transparent icebox with a warm heart.
        Food and yoga are her two biggest passions.
      </p>
      <br/>
      <p>
        She always brings her favorite ice cream stick to the yoga studio —
        especially on hot summer days.
      </p>
      <br/>
      <p>
        Legend says: if you can reconstruct exactly how she carried it,
        she'll share one with you.
      </p>
      <br/>
      <p>
        You are given how Frostra looks when she arrives as a cube, and the net she
        becomes when unfolded.
      </p>
    </>
  ),

  questionOneLiner: (
    <>
      Choose a triangle <b>on the net</b> to place the ice cream so that folding it into a
      cube matches the given cube exactly.
    </>
  ),

  hint: (
    <>
      <p>
        Think in reverse: every face on the net becomes a specific face on the cube
        after folding.
      </p>
      <p>
        Track the ice cream's face first, then its orientation.
      </p>
    </>
  ),
};


const level6 = {
  name: 'Iris',
  title: "The Evil Eye's Final Inspection",

  intro: (
    <>
      <p>
        <strong>Iris</strong> is an Evil Eye from the Dark Magic Academy.
        After graduating with top grades, it somehow became a security inspector
        at the local airport.
      </p>
      <br/>
      <p>
        It visits the yoga studio to stretch and relax its overworked eye nerves.
        But as a true mental-yoga master, it sometimes challenges friends with
        puzzles that push spatial intuition to the limit.
      </p>
      <br/>
      <p>
        Are you ready for the hardest challenge?
      </p>
    </>
  ),

  questionOneLiner: (   
    <>
      Use the <b>rotation controls below</b> to rotate the cube so that,
      when unfolded to a net, it matches the given net exactly.
    </>
  ),

  hint: (
    <>
      <p>The Evil Eye stole the hint note.</p>
      <p>
        No hints this time — only perfect alignment will pass the
        inspection.
      </p>
    </>
  ),
};


export const LEVEL_COPY = {
  1: level1,    // Cookie
  2: level2,    // Cluck
  3: level3,    // Pipes
  4: level4,    // Blueb
  5: level5,    // Frostra
  6: level6,    // Iris
};
